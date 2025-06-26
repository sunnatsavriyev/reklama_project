# Bitta FROM yetarli, Python versiyasi 3.11
FROM python:3.11-slim

# Docker o‘qishini optimallashtirish
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# PostgreSQL uchun kutubxonalar va foydali vositalar
RUN apt-get update && apt-get install --no-install-recommends -y \
    libpq-dev \
    netcat-openbsd \
    make \
    gettext \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


# Loyihani ishchi katalogi
WORKDIR /app

# Kutubxonalar uchun requirements
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Loyihani konteynerga nusxalash
COPY . .

# Static fayllar yig‘ish va migratsiya (ixtiyoriy, ishlamay qolsa `|| true` bilan)
RUN python manage.py collectstatic --noinput || true
RUN python manage.py migrate || true

# Gunicorn orqali serverni ishga tushurish
CMD ["gunicorn", "home.wsgi:application", "--bind", "0.0.0.0:8020"]
