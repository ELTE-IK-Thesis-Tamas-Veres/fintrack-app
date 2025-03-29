FROM nginx:latest

# Remove the default configuration files in conf.d
RUN rm /etc/nginx/conf.d/*

# Copy your custom nginx configuration into the image
ARG NGINX_CONF
COPY ${NGINX_CONF} /etc/nginx/nginx.conf

# Expose HTTP and HTTPS ports
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
