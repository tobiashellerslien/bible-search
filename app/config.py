import os


class Config:
    DEBUG = False
    PORT = int(os.environ.get("PORT", 8421))
    HOST = os.environ.get("HOST", "0.0.0.0")


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    pass


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
