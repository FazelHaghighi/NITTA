import jwt
from datetime import datetime, timedelta
from application.common.jwt_token_generator_interface import IJwtTokenGenerator
from domain.user import User

class JwtTokenGenerator(IJwtTokenGenerator):
    SECRET_KEY = "d6c5628868b656f543fd76d77a7abc53"

    def generate_token(self, user: User) -> str:
        payload = {
            "user_id": str(user.id),
            "exp": datetime.now() + timedelta(days=1)
        }
        return jwt.encode(payload, self.SECRET_KEY, algorithm="HS256")
