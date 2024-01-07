from rest_framework.authtoken.views import Token
from inspect import iscoroutinefunction
from logging import getLogger
from channels.exceptions import AcceptConnection, DenyConnection, StopConsumer
from functools import wraps


logger = getLogger()

# create auth token for registered user
def create_token(user):
    Token.objects.create(user=user)

# get authenticated user token
def get_token(user):
    token = Token.objects.get(user=user)
    return token

# get authenticated user
def get_user_helper(token):
    user = Token.objects.get(
            key=token,
        ).user
    return user

# extract token adn room from query params
def extract_params(params):
    room = params[1]
    token = params[0]
    room = room.split("=")[1].replace("'", "")
    token = token.split("=")[1].replace("'", "")
    return token, room

# decorator to propagate errors for websocket consumers
def apply_wrappers(consumer_class):
    for method_name, method in list(consumer_class.__dict__.items()):
        if iscoroutinefunction(method):  # an async method
            # wrap the method with a decorator that propagate exceptions
            setattr(consumer_class, method_name, propagate_exceptions(method))
    return consumer_class


def propagate_exceptions(func):
    async def wrapper(*args, **kwargs):  # we're wrapping an async function
        try:
            return await func(*args, **kwargs)
        except (AcceptConnection, DenyConnection, StopConsumer):  # these are handled by channels
            raise
        except Exception as exception:  # any other exception
            # avoid logging the same exception multiple times
            if not getattr(exception, "caught", False):
                setattr(exception, "caught", True)
                logger.error(
                    "Exception occurred in {}:".format(func.__qualname__),
                    exc_info=exception,
                )
            raise  # propagate the exception
    return wraps(func)(wrapper)
