OM nginx:alpine

# Copy static files
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

# Custom nginx configuration if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set environment variables (they'll be replaced at runtime)
ENV API_URL="http://notes-api-service:8080"
ENV THEME_COLOR="blue"

# Expose port
EXPOSE 80

# Create startup script to replace environment variables
RUN echo '#!/bin/sh\n\
sed -i "s|const API_URL = .*|const API_URL = \"$API_URL\";|g" /usr/share/nginx/html/app.js\n\
sed -i "s|const theme = .*|const theme = \"$THEME_COLOR\";|g" /usr/share/nginx/html/app.js\n\
nginx -g "daemon off;"' > /docker-entrypoint.sh && \
chmod +x /docker-entrypoint.sh

CMD ["/docker-entrypoint.sh"]