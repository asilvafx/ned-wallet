// src/RetroAvatarGenerator.js

class RetroAvatarGenerator {
    constructor() {
        this.init(); // Call the init method to start the avatar generation
    }

    init = () => {
        document.querySelectorAll('.retro-avatar').forEach(span => {
            const id = span.getAttribute('data-retro-id');

            // Check if id is valid
            if (!id) {
                return; // Skip this iteration if id is not valid
            }

            const size = parseInt(span.getAttribute('data-retro-size'), 10) || 32;
            const roundType = span.getAttribute('data-round');
            const density = parseInt(span.getAttribute('data-density'), 10) || 1;

            const scaleFactor = 4;
            const canvas = document.createElement('canvas');
            canvas.width = size * scaleFactor;
            canvas.height = size * scaleFactor;

            const ctx = canvas.getContext('2d');

            // Call the drawRetroAvatar method
            this.drawRetroAvatar(id, size * scaleFactor, ctx, density);

            canvas.style.width = `${size}px`;
            canvas.style.height = `${size}px`;

            canvas.classList.add(...span.classList);
            if (roundType === '1') {
                canvas.style.borderRadius = '50%';
            } else if (roundType === '2') {
                canvas.style.borderRadius = '.25rem';
            }

            span.parentNode.replaceChild(canvas, span);
        });
    }

    idToSeed = (id) => {
        let seed = 0;
        for (let i = 0; i < id.length; i++) {
            seed = id.charCodeAt(i) + ((seed << 5) - seed);
        }
        return seed;
    }

    randomizeColor = (seed, patternColors) => {
        const index = Math.abs(seed) % patternColors.length;
        return patternColors[index];
    }

    getLightColor = (seed) => {
        const avatarColors = [
            "#9763f8", "#e5739f", "#bbf5ec", "#5df0ab", "#4ac6e3",
            "#ff6b6b", "#ffb84d", "#8fa3ae", "#f490b1", "#aed581",
            "#f9e180", "#84b84c", "#4b4b6c", "#d9d9d9"
        ];

        return this.randomizeColor(seed, avatarColors);
    }

    getDarkerVibrantColor = (seed) => {
        const backgroundColors = [
            "#401354", "#404c29", "#625a01", "#59282a", "#4e6a03",
            "#8fa3ae", "#f490b1", "#aed581", "#ff6b6b", "#ffb84d",
            "#4b4b6c", "#84b84c", "#d9d9d9", "#f9e180"
        ];

        return this.randomizeColor(seed, backgroundColors);
    }

    getAvatarAndBackgroundColors = (seed) => {
        const maxAttempts = 5;
        let avatarColor = this.getLightColor(seed);
        let backgroundColor = this.getDarkerVibrantColor(seed);

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            if (this.isContrastSufficient(avatarColor, backgroundColor)) {
                break;
            } else {
                avatarColor = this.getLightColor(seed + attempt + 1);
                backgroundColor = this.getDarkerVibrantColor(seed + attempt + 2);
            }
        }

        return [avatarColor, backgroundColor];
    }

    isContrastSufficient = (color1, color2) => {
        const luminance1 = this.getLuminance(color1);
        const luminance2 = this.getLuminance(color2);
        const contrast = (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05);
        return contrast > 3; // Ensure contrast ratio is above 3:1
    }

    getLuminance = (color) => {
        const rgb = parseInt(color.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = rgb & 0xff;

        const a = [r, g, b].map(c => {
            c /= 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });

        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    drawRetroAvatar = (id, size, ctx, density) => {
        const seed = this.idToSeed(id);
        const gridSize = density === 2 ? 4 : 8; // Adjust grid size for density
        const pixelSize = size / gridSize; // Adjust pixel size based on grid size

        const [avatarColor, backgroundColor] = this.getAvatarAndBackgroundColors(seed);

        // Fill the background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, size, size);

        // Draw the avatar with the adjusted density and pixel size
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize / 2; x++) {
                const shouldFill = (seed >> (y * 4 + x)) & 1;
                if (shouldFill) {
                    ctx.fillStyle = avatarColor;
                    // Draw pixel on the left side
                    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                    // Draw pixel on the mirrored right side
                    ctx.fillRect((gridSize - 1 - x) * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            }
        }
    }
}

export default RetroAvatarGenerator;