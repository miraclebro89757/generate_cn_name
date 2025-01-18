from app import app

# Vercel需要这个handler
def handler(request, context):
    return app(request)
