#!/bin/sh

# Configuración del modelo (cambiar según necesidad)
MODEL="llama3:8b-instruct-q4_0"

# 1. Inicia el servidor en segundo plano
echo "🔄 Iniciando servidor Ollama..."
ollama serve &

# 2. Espera usando el propio ejecutable de Ollama
echo "⏳ Esperando inicialización del servidor (modelo: $MODEL)..."
timeout=30
while ! ollama list >/dev/null 2>&1; do
    sleep 1
    timeout=$((timeout-1))
    [ $timeout -le 0 ] && echo "❌ Error: Tiempo de espera agotado" && exit 1
done

# 3. Descarga el modelo si no existe
echo "🔍 Verificando modelo $MODEL..."
if ! ollama list | grep -q "$MODEL"; then
    echo "⬇️ Descargando modelo..."
    ollama pull "$MODEL" || exit 1
fi

# Verificación final
echo "🚀 Configuración activa:"
echo " - Modelo: $MODEL"

exec tail -f /dev/null