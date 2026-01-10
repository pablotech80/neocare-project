.PHONY: help install install-frontend setup-db run run-dev run-frontend build-frontend clean env-setup

PYTHON := python3
VENV := venv
VENV_BIN := $(VENV)/bin
BACKEND_DIR := backend
FRONTEND_DIR := frontend

help:
	@echo "NeoCare - Comandos disponibles:"
	@echo ""
	@echo "Backend:"
	@echo "  make install         - Instalar dependencias Python"
	@echo "  make setup-db        - Crear base de datos"
	@echo "  make env-setup       - Crear archivo .env"
	@echo "  make run-dev         - Iniciar backend (desarrollo)"
	@echo "  make run             - Iniciar backend (producción)"
	@echo ""
	@echo "Frontend:"
	@echo "  make install-frontend - Instalar dependencias Node"
	@echo "  make run-frontend     - Iniciar frontend (desarrollo)"
	@echo "  make build-frontend   - Build de producción"
	@echo ""
	@echo "General:"
	@echo "  make clean           - Limpiar archivos temporales"
	@echo ""
	@echo "Setup rápido:"
	@echo "  Backend: make install && make env-setup && make setup-db"
	@echo "  Frontend: make install-frontend"
	@echo "  Iniciar: make run-dev (backend) + make run-frontend (frontend)"

install:
	@echo "Creando entorno virtual..."
	$(PYTHON) -m venv $(VENV)
	@echo "Actualizando pip..."
	$(VENV_BIN)/pip install --upgrade pip setuptools wheel
	@echo "Instalando dependencias..."
	$(VENV_BIN)/pip install -r requirements.txt
	@echo ""
	@echo "Instalación completada!"
	@echo "Activa el entorno: source $(VENV_BIN)/activate"

setup-db:
	@echo "Creando base de datos neocare..."
	createdb neocare || echo "Base de datos ya existe"
	@echo "Base de datos lista"

env-setup:
	@if [ ! -f .env ]; then \
		echo "Creando archivo .env..."; \
		cp env.example .env; \
		echo "Archivo .env creado. Edita las credenciales antes de continuar."; \
	else \
		echo "El archivo .env ya existe."; \
	fi

run:
	@echo "Iniciando servidor..."
	$(VENV_BIN)/uvicorn backend.main:app --host 0.0.0.0 --port 8000

run-dev:
	@echo "Iniciando servidor en modo desarrollo..."
	$(VENV_BIN)/uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

install-frontend:
	@echo "Instalando dependencias del frontend..."
	@cd $(FRONTEND_DIR) && npm install
	@echo ""
	@echo "Instalación del frontend completada!"

run-frontend:
	@echo "Iniciando frontend en modo desarrollo..."
	@cd $(FRONTEND_DIR) && npm run dev

build-frontend:
	@echo "Construyendo frontend para producción..."
	@cd $(FRONTEND_DIR) && npm run build
	@echo "Build completado en $(FRONTEND_DIR)/dist"

clean:
	@echo "Limpiando archivos temporales..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	@echo "Limpieza completada"
