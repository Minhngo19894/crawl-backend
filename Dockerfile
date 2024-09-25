# Chọn hình ảnh Node.js
FROM node:18

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Cài đặt các phụ thuộc cần thiết cho Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Cài đặt trình duyệt Chromium
RUN npm install puppeteer

# Mở cổng mà ứng dụng sẽ lắng nghe
EXPOSE 5000

# Lệnh khởi động ứng dụng
CMD ["node", "index.js"]
