/**
 * Dialogue system for character speech bubbles
 */
export class DialogueSystem {
    constructor(scene) {
        this.scene = scene;
        this.activeBubble = null;
        this.currentSpeaker = null;
    }

    /**
     * Show dialogue bubble above a character
     */
    showDialogue(x, y, text, duration = 3000) {
        // Remove existing bubble if any
        this.hideDialogue();

        // Create background bubble
        const padding = 15;
        const maxWidth = 300;
        
        // Create temporary text to measure size
        const tempText = this.scene.add.text(0, 0, text, {
            fontSize: '16px',
            fontFamily: 'Indie Flower, cursive',
            color: '#2C2C2C',
            align: 'center',
            wordWrap: { width: maxWidth - padding * 2 }
        });
        
        const textWidth = Math.min(tempText.width, maxWidth - padding * 2);
        const textHeight = tempText.height;
        const bubbleWidth = textWidth + padding * 2;
        const bubbleHeight = textHeight + padding * 2;
        
        // Create bubble background
        const bubble = this.scene.add.graphics();
        bubble.fillStyle(0xFFFFFF, 0.95);
        bubble.lineStyle(3, 0x2C2C2C, 1);
        
        // Rounded rectangle for bubble
        const bubbleX = x - bubbleWidth / 2;
        const bubbleY = y - 100 - bubbleHeight;
        bubble.fillRoundedRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 10);
        bubble.strokeRoundedRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 10);
        
        // Speech bubble pointer (triangle)
        bubble.fillTriangle(
            x - 10, bubbleY + bubbleHeight,
            x + 10, bubbleY + bubbleHeight,
            x, bubbleY + bubbleHeight + 15
        );
        bubble.lineStyle(3, 0x2C2C2C, 1);
        bubble.strokeTriangle(
            x - 10, bubbleY + bubbleHeight,
            x + 10, bubbleY + bubbleHeight,
            x, bubbleY + bubbleHeight + 15
        );
        
        bubble.setDepth(10000);
        
        // Position text inside bubble
        tempText.setPosition(bubbleX + padding, bubbleY + padding);
        tempText.setDepth(10001);
        
        // Store references
        this.activeBubble = {
            bubble: bubble,
            text: tempText
        };
        
        // Auto-hide after duration
        if (duration > 0) {
            this.scene.time.delayedCall(duration, () => {
                this.hideDialogue();
            });
        }
    }

    /**
     * Hide current dialogue bubble
     */
    hideDialogue() {
        if (this.activeBubble) {
            this.activeBubble.bubble.destroy();
            this.activeBubble.text.destroy();
            this.activeBubble = null;
        }
    }

    /**
     * Check if dialogue is currently showing
     */
    isShowing() {
        return this.activeBubble !== null;
    }

    /**
     * Destroy dialogue system
     */
    destroy() {
        this.hideDialogue();
    }
}

export default DialogueSystem;

