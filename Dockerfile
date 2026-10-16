FROM ghcr.io/astral-sh/uv:python3.14-bookworm-slim
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project
COPY main.py ./
COPY app ./app
ENV PATH="/app/.venv/bin:$PATH"
EXPOSE 8000
CMD ["fastapi", "run", "main.py", "--host", "0.0.0.0", "--port", "8000"]
