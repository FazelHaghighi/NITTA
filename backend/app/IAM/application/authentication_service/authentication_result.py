from pydantic import BaseModel
from domain.user import User

class AuthenticationResult(BaseModel):
    user: User
    token: str
