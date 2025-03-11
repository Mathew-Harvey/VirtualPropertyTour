# RealVision3D - Unreal Engine Streaming Server Integration

This document provides comprehensive instructions for setting up and integrating an Unreal Engine streaming server with the RealVision3D platform. This integration enables real-time streaming of interactive 3D virtual property tours to end users' browsers.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Server Setup](#server-setup)
- [Unreal Engine Configuration](#unreal-engine-configuration)
- [API Integration](#api-integration)
- [Security Configuration](#security-configuration)
- [Deployment](#deployment)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)

## System Overview

The RealVision3D streaming system consists of:

1. **Unreal Engine Rendering Server**: Processes 3D environments and streams interactive content
2. **Streaming Gateway**: Manages connections, authentication, and session state
3. **Asset Management System**: Stores and delivers 3D models, textures, and property data
4. **Web Integration Layer**: Connects the RealVision3D website with the streaming infrastructure

This integration allows website visitors to explore property virtual tours without installing additional software, directly in their web browsers.

## Architecture

```
┌─────────────────┐    ┌───────────────────┐    ┌────────────────────┐
│  RealVision3D   │    │  Streaming        │    │  Unreal Engine     │
│  Web Platform   │◄───┤  Gateway          │◄───┤  Rendering Servers │
└─────────────────┘    └───────────────────┘    └────────────────────┘
        ▲                        ▲                       ▲
        │                        │                       │
        │                        │                       │
        │                        │                       │
┌─────────────────┐    ┌───────────────────┐    ┌────────────────────┐
│  Web Clients    │    │  Authentication   │    │  Asset Management  │
│  (Browsers)     │    │  & Authorization  │    │  System            │
└─────────────────┘    └───────────────────┘    └────────────────────┘
```

## Prerequisites

- Server hardware with:
  - CPU: Minimum Intel Xeon E5-2680 v4 or AMD EPYC 7351 (14+ cores recommended)
  - GPU: NVIDIA RTX A4000 or better (dedicated GPU for each concurrent stream)
  - RAM: 64GB minimum (128GB recommended)
  - Storage: NVMe SSD with 1TB+ capacity
  - Network: 1Gbps connection (dedicated, low latency)

- Software requirements:
  - Ubuntu Server 22.04 LTS or Windows Server 2022
  - NVIDIA GPU Drivers (latest)
  - Docker and Docker Compose
  - Unreal Engine 5.2+ (with Pixel Streaming plugin)
  - NGINX with RTMP module
  - Node.js 18.x LTS

## Server Setup

### Base Server Configuration

1. Update the server and install dependencies:

```bash
# For Ubuntu Server
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential git curl wget nginx

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

2. Install NVIDIA drivers and CUDA:

```bash
# Add NVIDIA repository
sudo add-apt-repository ppa:graphics-drivers/ppa
sudo apt update

# Install drivers and CUDA
sudo apt install -y nvidia-driver-535 nvidia-cuda-toolkit
```

3. Configure NGINX with RTMP:

```bash
# Install NGINX RTMP module
sudo apt install -y libnginx-mod-rtmp

# Create or edit NGINX config
sudo nano /etc/nginx/nginx.conf
```

Add the following configuration to `nginx.conf`:

```nginx
rtmp {
    server {
        listen 1935;
        chunk_size 4096;
        
        application unreal {
            live on;
            record off;
            
            # Only allow localhost connections
            allow publish 127.0.0.1;
            deny publish all;
            
            # Allow playback from all
            allow play all;
        }
    }
}
```

### Streaming Gateway Setup

1. Clone the streaming gateway repository:

```bash
git clone https://github.com/realvision3d/streaming-gateway.git
cd streaming-gateway
```

2. Install dependencies and configure:

```bash
npm install
cp config.example.json config.json
nano config.json
```

3. Configure the gateway settings in `config.json`:

```json
{
  "server": {
    "port": 8080,
    "cors": {
      "origin": "https://www.realvision3d.com",
      "methods": ["GET", "POST"]
    }
  },
  "unreal": {
    "servers": [
      {
        "id": "server1",
        "host": "localhost",
        "port": 8888,
        "capacity": 5
      }
    ]
  },
  "auth": {
    "jwtSecret": "YOUR_SECRET_KEY",
    "tokenExpiry": "1h"
  },
  "storage": {
    "assetPath": "/var/unreal/assets",
    "tempPath": "/var/unreal/temp"
  }
}
```

4. Run the gateway server:

```bash
npm start
```

For production deployment, set up a service:

```bash
sudo nano /etc/systemd/system/streaming-gateway.service
```

Add the following content:

```ini
[Unit]
Description=RealVision3D Streaming Gateway
After=network.target

[Service]
Type=simple
User=unreal
WorkingDirectory=/path/to/streaming-gateway
ExecStart=/usr/bin/npm start
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl enable streaming-gateway
sudo systemctl start streaming-gateway
```

## Unreal Engine Configuration

### Preparing the Unreal Engine Project

1. Set up a base Unreal Engine project optimized for architectural visualization:

```bash
# Clone our base project repository
git clone https://github.com/realvision3d/unreal-base-project.git
cd unreal-base-project
```

2. Configure the Pixel Streaming plugin:

- Open the Unreal Engine project
- Navigate to Edit → Plugins
- Enable "Pixel Streaming" plugin
- Restart the editor when prompted

3. Configure project settings for streaming:

- Go to Project Settings → Pixel Streaming
- Set the following values:
  - Enable Pixel Streaming: Yes
  - Encoder: NVENC
  - Target Bitrate: 10000 (adjust based on quality requirements)
  - Min QP: 20
  - Max QP: 35
  - Enable Low Latency Mode: Yes
  - WebRTC Handshake Timeout: 20000
  - Enable GPU Adapter: Yes
  
4. Configure input handling for virtual tours:

- Go to Project Settings → Input
- Configure action mappings for navigation (WASD, mouse look, click interactions)
- Set up special interactions for virtual tour hotspots

### Packaging the Unreal Engine Project

1. Prepare the project for packaging:

```bash
# Package the project from command line
"C:/Program Files/Epic Games/UE_5.2/Engine/Build/BatchFiles/RunUAT.bat" BuildCookRun -project="/path/to/project/RealVision3D.uproject" -noP4 -platform=Win64 -clientconfig=Development -serverconfig=Development -cook -allmaps -build -stage -pak -archive -archivedirectory="/path/to/output"
```

2. Create a deployment script for the packaged project:

```bash
# Create start_streaming.bat (Windows) or start_streaming.sh (Linux)
echo "@echo off
start /b RealVision3D.exe -PixelStreamingIP=127.0.0.1 -PixelStreamingPort=8888 -RenderOffscreen" > start_streaming.bat
```

## API Integration

### Integrating with RealVision3D Web Platform

1. Connect the website to the streaming gateway:

Add the following code to your virtual tour page:

```javascript
// In virtual-tour.js
class UnrealStreamingClient {
  constructor(propertyId, containerElement) {
    this.propertyId = propertyId;
    this.container = containerElement;
    this.streamUrl = null;
    this.player = null;
  }
  
  async initialize() {
    try {
      // Request streaming session from gateway
      const response = await fetch('https://stream.realvision3d.com/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getUserToken()}`
        },
        body: JSON.stringify({
          propertyId: this.propertyId,
          resolution: {
            width: this.container.clientWidth,
            height: this.container.clientHeight
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to start streaming session');
      }
      
      const sessionData = await response.json();
      this.streamUrl = sessionData.streamUrl;
      
      // Initialize the player
      await this.setupPlayer();
      
    } catch (error) {
      console.error('Streaming initialization error:', error);
      this.showFallbackContent();
    }
  }
  
  async setupPlayer() {
    // Create container for the streaming player
    const playerElement = document.createElement('div');
    playerElement.className = 'unreal-player';
    this.container.appendChild(playerElement);
    
    // Load the Pixel Streaming client library
    await loadScript('https://stream.realvision3d.com/js/pixel-streaming-client.js');
    
    // Initialize the player
    this.player = new PixelStreamingClient({
      containerElement: playerElement,
      streamUrl: this.streamUrl,
      controlScheme: 'property-tour',
      onConnect: this.handleConnect.bind(this),
      onDisconnect: this.handleDisconnect.bind(this),
      onError: this.handleError.bind(this)
    });
    
    // Start the connection
    await this.player.connect();
  }
  
  handleConnect() {
    console.log('Connected to Unreal Engine stream');
    this.container.classList.add('connected');
    
    // Hide loading indicator
    const loadingElement = this.container.querySelector('.loading-indicator');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }
  
  handleDisconnect() {
    console.log('Disconnected from Unreal Engine stream');
    this.container.classList.remove('connected');
    
    // Show reconnection UI
    this.showReconnectionUI();
  }
  
  handleError(error) {
    console.error('Streaming error:', error);
    this.showFallbackContent();
  }
  
  showReconnectionUI() {
    const reconnectUI = document.createElement('div');
    reconnectUI.className = 'reconnect-ui';
    reconnectUI.innerHTML = `
      <div class="reconnect-message">
        <h3>Connection Lost</h3>
        <p>The connection to the virtual tour was interrupted.</p>
        <button class="btn btn-primary reconnect-btn">Reconnect</button>
      </div>
    `;
    
    const reconnectBtn = reconnectUI.querySelector('.reconnect-btn');
    reconnectBtn.addEventListener('click', () => {
      this.container.removeChild(reconnectUI);
      this.initialize();
    });
    
    this.container.appendChild(reconnectUI);
  }
  
  showFallbackContent() {
    // If streaming fails, show fallback content (360 photos, etc.)
    this.container.innerHTML = `
      <div class="fallback-content">
        <div class="fallback-message">
          <h3>Virtual Tour Unavailable</h3>
          <p>We're experiencing technical difficulties with the interactive tour.</p>
          <p>Please try again later or view our gallery of high-resolution photos instead.</p>
        </div>
        <div class="fallback-gallery">
          <!-- Insert fallback gallery images here -->
        </div>
      </div>
    `;
  }
  
  dispose() {
    if (this.player) {
      this.player.disconnect();
    }
  }
}

// Usage
document.addEventListener('DOMContentLoaded', () => {
  const tourContainer = document.querySelector('.virtual-tour-container');
  const propertyId = getPropertyIdFromUrl();
  
  if (tourContainer && propertyId) {
    const streamingClient = new UnrealStreamingClient(propertyId, tourContainer);
    streamingClient.initialize();
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      streamingClient.dispose();
    });
  }
});
```

2. Add the streaming container to your HTML:

```html
<div class="virtual-tour-container">
  <div class="loading-indicator">
    <div class="spinner"></div>
    <p>Loading Virtual Tour...</p>
  </div>
  
  <!-- The streaming player will be inserted here -->
  
  <div class="tour-controls">
    <!-- Your existing tour controls here -->
  </div>
</div>
```

## Security Configuration

### Authentication and Authorization

1. Set up JWT-based authentication:

```javascript
// In auth.js
const jwt = require('jsonwebtoken');
const config = require('./config.json');

function generateStreamingToken(userId, propertyId) {
  const payload = {
    userId,
    propertyId,
    permissions: ['view'],
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiry
  };
  
  return jwt.sign(payload, config.auth.jwtSecret);
}

function verifyStreamingToken(token) {
  try {
    return jwt.verify(token, config.auth.jwtSecret);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateStreamingToken,
  verifyStreamingToken
};
```

2. Secure the streaming endpoints:

```javascript
// In server.js
const express = require('express');
const { verifyStreamingToken } = require('./auth');
const app = express();

// Middleware to validate streaming tokens
function requireStreamingAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  const decoded = verifyStreamingToken(token);
  
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  // Add the decoded token to the request
  req.user = decoded;
  next();
}

// Protected streaming endpoint
app.post('/api/session', requireStreamingAuth, (req, res) => {
  // Session creation logic
});
```

### SSL Configuration

1. Set up SSL certificates:

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain and configure certificates
sudo certbot --nginx -d stream.realvision3d.com
```

2. Configure NGINX for secure streaming:

```nginx
server {
    listen 443 ssl;
    server_name stream.realvision3d.com;
    
    ssl_certificate /etc/letsencrypt/live/stream.realvision3d.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/stream.realvision3d.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Deployment

### Docker Deployment

1. Create a Docker Compose file for the streaming infrastructure:

```yaml
# docker-compose.yml
version: '3.8'

services:
  streaming-gateway:
    build: ./streaming-gateway
    ports:
      - "8080:8080"
    volumes:
      - ./config.json:/app/config.json
      - ./assets:/var/unreal/assets
      - ./temp:/var/unreal/temp
    restart: always
    networks:
      - streaming-network

  signaling-server:
    image: realvision3d/unreal-signaling-server:latest
    ports:
      - "8888:8888"
    environment:
      - PEERCONNECTION_ENABLE_BDADDR=1
      - WEBRTC_DEBUG=INFO
    restart: always
    networks:
      - streaming-network

  unreal-streamer:
    image: realvision3d/unreal-engine-streamer:latest
    runtime: nvidia
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
      - NVIDIA_DRIVER_CAPABILITIES=all
    volumes:
      - ./unreal-projects:/unreal-projects
    depends_on:
      - signaling-server
    restart: always
    networks:
      - streaming-network

networks:
  streaming-network:
    driver: bridge
```

2. Run the containers:

```bash
docker-compose up -d
```

### Scaling Configuration

For larger deployments, use Kubernetes for orchestration:

```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: unreal-streamer
spec:
  replicas: 5
  selector:
    matchLabels:
      app: unreal-streamer
  template:
    metadata:
      labels:
        app: unreal-streamer
    spec:
      containers:
      - name: unreal-streamer
        image: realvision3d/unreal-engine-streamer:latest
        resources:
          limits:
            nvidia.com/gpu: 1
        volumeMounts:
        - name: unreal-projects
          mountPath: /unreal-projects
      volumes:
      - name: unreal-projects
        persistentVolumeClaim:
          claimName: unreal-projects-pvc
```

## Performance Optimization

### Server Optimization

1. GPU settings for maximum streaming performance:

```bash
# Create a file for Unreal Engine GPU optimization
sudo nano /etc/nvidia-container-runtime/config.toml
```

Add the following content:

```toml
[nvidia-container-cli]
#root = "/run/nvidia/driver"
#path = "/usr/bin/nvidia-container-cli"
environment = []
#debug = "/var/log/nvidia-container-toolkit.log"
#ldcache = "/etc/ld.so.cache"
load-kmods = true
#no-cgroups = false
#user = "root:video"
ldconfig = "@/sbin/ldconfig"

[nvidia-container-runtime]
#debug = "/var/log/nvidia-container-runtime.log"
log-level = "info"

# Unreal Engine specific optimizations
[nvidia-container-runtime.options]
graphics-devices = "all"
graphics-driver-capabilities = "compute,video,utility,graphics"
```

2. System settings for streaming:

```bash
# Edit sysctl configuration
sudo nano /etc/sysctl.conf
```

Add the following settings:

```
# Network settings for low-latency streaming
net.core.wmem_max=12582912
net.core.rmem_max=12582912
net.ipv4.tcp_rmem= 10240 87380 12582912
net.ipv4.tcp_wmem= 10240 87380 12582912
net.ipv4.tcp_window_scaling = 1
net.ipv4.tcp_timestamps = 1
net.ipv4.tcp_sack = 1
net.ipv4.tcp_no_metrics_save = 1
net.core.netdev_max_backlog = 5000
```

Apply the changes:

```bash
sudo sysctl -p
```

### Unreal Engine Optimization

1. Adjust Unreal Engine rendering settings:

- Disable screen-space reflections
- Use distance field ambient occlusion instead of SSAO
- Lower shadow quality for distant objects
- Implement level of detail (LOD) for all assets
- Use texture streaming for large environments
- Implement occlusion culling
- Optimize lighting with precomputed lighting

2. Content optimization guidelines:

- Keep triangle count under 3 million visible at any time
- Use texture atlasing for materials
- Limit dynamic lights to 4-6 at most
- Use instanced static meshes for repeated elements
- Avoid post-processing effects when possible
- Use detail meshes for close-up views only

## Troubleshooting

### Common Issues

1. **High Latency**

- Check network connection between server and client
- Verify GPU is not throttling (monitor temperature)
- Ensure server has adequate bandwidth (at least 10Mbps per concurrent stream)
- Reduce encoding bitrate
- Check for network congestion

2. **Connection Failures**

- Verify WebRTC ports are open (UDP 8888-8889)
- Check SSL certificates are valid
- Ensure signaling server is running
- Verify STUN/TURN servers are accessible
- Check for firewall or proxy issues

3. **Poor Quality**

- Increase encoding bitrate
- Check if bandwidth is sufficient
- Verify GPU has enough VRAM (at least 8GB recommended)
- Review Unreal Engine rendering settings
- Check client's connection speed

4. **Server Crashes**

- Monitor GPU and CPU usage
- Check system logs for errors
- Verify adequate cooling for GPUs
- Check for memory leaks
- Ensure Unreal Engine is using NVENC properly

### Diagnostic Tools

1. WebRTC debugging:

```javascript
// Enable in the client code
window.localStorage.setItem('debug', 'pixelstreaming:*');
```

2. Server monitoring:

```bash
# Install monitoring tools
sudo apt install -y htop iotop iftop nvidia-smi

# GPU monitoring
watch -n 1 nvidia-smi

# Network monitoring
sudo iftop -i eth0

# System monitoring
htop
```

## Maintenance

### Backup Procedures

1. Regular backups of configuration and assets:

```bash
# Create backup script
nano backup.sh
```

Add the following content:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/realvision3d"
DATE=$(date +%Y%m%d)

# Create backup directory
mkdir -p $BACKUP_DIR/$DATE

# Backup configuration
cp /path/to/streaming-gateway/config.json $BACKUP_DIR/$DATE/
cp /etc/nginx/nginx.conf $BACKUP_DIR/$DATE/

# Backup asset metadata
mysqldump -u username -p database_name assets_table > $BACKUP_DIR/$DATE/assets.sql

# Compress backup
tar -czf $BACKUP_DIR/backup-$DATE.tar.gz $BACKUP_DIR/$DATE

# Remove temp directory
rm -rf $BACKUP_DIR/$DATE

# Keep last 7 backups
find $BACKUP_DIR -name "backup-*.tar.gz" -type f -mtime +7 -delete
```

Make the script executable and schedule it:

```bash
chmod +x backup.sh
sudo crontab -e
```

Add this line to run daily backups:

```
0 2 * * * /path/to/backup.sh > /var/log/backup.log 2>&1
```

### Updating Procedures

1. Streaming server updates:

```bash
# Pull latest changes
cd /path/to/streaming-gateway
git pull

# Install dependencies
npm install

# Restart service
sudo systemctl restart streaming-gateway
```

2. Unreal Engine updates:

- Create a staging environment for testing updates
- Test with sample property models
- Measure performance and quality changes
- Schedule updates during low traffic periods

```bash
# Update Docker images
docker pull realvision3d/unreal-engine-streamer:latest
docker-compose up -d
```

## Final Notes

This integration connects your RealVision3D website with an Unreal Engine streaming backend to deliver immersive virtual property tours. The system is designed to scale with increased demand and provide high-quality experiences across various client devices.

For assistance with setup or troubleshooting, contact the RealVision3D technical support team at tech-support@realvision3d.com.

---

© 2025 RealVision3D. All rights reserved.