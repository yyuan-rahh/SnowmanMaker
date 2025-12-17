/**
 * Sound System - Procedurally generated sound effects using Web Audio API
 */
export class SoundSystem {
    constructor(scene) {
        this.scene = scene;
        this.audioContext = null;
        this.masterVolume = 0.3; // Overall volume control
        
        // Initialize audio context on first user interaction
        this.initAudioContext();
    }

    /**
     * Initialize Web Audio API context
     */
    initAudioContext() {
        // Create audio context on first user interaction (browser requirement)
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    /**
     * Play item collection sound (cheerful sparkle)
     */
    playItemCollect() {
        this.initAudioContext();
        
        const now = this.audioContext.currentTime;
        
        // Create oscillator for sparkle effect
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Ascending sparkle notes
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, now); // C5
        oscillator.frequency.setValueAtTime(659.25, now + 0.05); // E5
        oscillator.frequency.setValueAtTime(783.99, now + 0.1); // G5
        
        // Fade in and out
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.3, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        oscillator.start(now);
        oscillator.stop(now + 0.3);
    }

    /**
     * Play dog bark sound
     */
    playDogBark() {
        this.initAudioContext();
        
        const now = this.audioContext.currentTime;
        
        // Create noise for bark texture
        const bufferSize = this.audioContext.sampleRate * 0.15;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Generate noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        
        // Low-pass filter for bark tone
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(200, now + 0.15);
        
        const gainNode = this.audioContext.createGain();
        
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Bark envelope
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.4, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        
        noise.start(now);
        noise.stop(now + 0.15);
    }

    /**
     * Play win sound (cheerful fanfare)
     */
    playWinSound() {
        this.initAudioContext();
        
        const now = this.audioContext.currentTime;
        
        // Victory chord progression
        const notes = [
            { freq: 523.25, time: 0 },     // C5
            { freq: 659.25, time: 0.15 },  // E5
            { freq: 783.99, time: 0.3 },   // G5
            { freq: 1046.50, time: 0.45 }  // C6
        ];
        
        notes.forEach(note => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(note.freq, now + note.time);
            
            gainNode.gain.setValueAtTime(0, now + note.time);
            gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.25, now + note.time + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + note.time + 0.25);
            
            oscillator.start(now + note.time);
            oscillator.stop(now + note.time + 0.25);
        });
    }

    /**
     * Play lose sound (sad descending notes)
     */
    playLoseSound() {
        this.initAudioContext();
        
        const now = this.audioContext.currentTime;
        
        // Descending sad notes
        const notes = [
            { freq: 523.25, time: 0 },     // C5
            { freq: 466.16, time: 0.15 },  // Bb4
            { freq: 392.00, time: 0.3 },   // G4
            { freq: 329.63, time: 0.45 }   // E4
        ];
        
        notes.forEach(note => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(note.freq, now + note.time);
            
            gainNode.gain.setValueAtTime(0, now + note.time);
            gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.3, now + note.time + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + note.time + 0.3);
            
            oscillator.start(now + note.time);
            oscillator.stop(now + note.time + 0.3);
        });
    }

    /**
     * Play collision thud sound
     */
    playCollisionSound() {
        this.initAudioContext();
        
        const now = this.audioContext.currentTime;
        
        // Create thud with low frequency
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(100, now);
        oscillator.frequency.exponentialRampToValueAtTime(40, now + 0.1);
        
        gainNode.gain.setValueAtTime(this.masterVolume * 0.5, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }

    /**
     * Play car honk sound
     */
    playCarHonk() {
        this.initAudioContext();
        
        const now = this.audioContext.currentTime;
        
        // Create two-tone honk
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator1.type = 'square';
        oscillator2.type = 'square';
        
        oscillator1.frequency.setValueAtTime(415, now); // G#4
        oscillator2.frequency.setValueAtTime(311, now); // D#4
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.2, now + 0.01);
        gainNode.gain.setValueAtTime(this.masterVolume * 0.2, now + 0.15);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        oscillator1.start(now);
        oscillator1.stop(now + 0.2);
        oscillator2.start(now);
        oscillator2.stop(now + 0.2);
    }

    /**
     * Play snowball rolling sound (soft whoosh)
     */
    playRollSound() {
        this.initAudioContext();
        
        const now = this.audioContext.currentTime;
        
        // Create soft whoosh with noise
        const bufferSize = this.audioContext.sampleRate * 0.3;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        
        const gainNode = this.audioContext.createGain();
        
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.1, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        noise.start(now);
        noise.stop(now + 0.3);
    }

    /**
     * Play celebration music (extended fanfare)
     */
    playCelebrationMusic() {
        this.initAudioContext();
        
        const now = this.audioContext.currentTime;
        
        // Extended victory fanfare with multiple notes
        const notes = [
            { freq: 523.25, time: 0 },     // C5
            { freq: 659.25, time: 0.1 },   // E5
            { freq: 783.99, time: 0.2 },   // G5
            { freq: 1046.50, time: 0.3 },  // C6
            { freq: 1174.66, time: 0.5 },  // D6
            { freq: 1318.51, time: 0.6 },  // E6
            { freq: 1567.98, time: 0.7 },  // G6
            { freq: 1046.50, time: 0.9 },  // C6
            { freq: 1318.51, time: 1.0 },  // E6
            { freq: 1567.98, time: 1.1 },  // G6
            { freq: 2093.00, time: 1.2 }   // C7
        ];
        
        notes.forEach(note => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(note.freq, now + note.time);
            
            gainNode.gain.setValueAtTime(0, now + note.time);
            gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.3, now + note.time + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + note.time + 0.4);
            
            oscillator.start(now + note.time);
            oscillator.stop(now + note.time + 0.4);
        });
    }

    /**
     * Play Santa arrival sound (sleigh bells)
     */
    playSantaSound() {
        this.initAudioContext();
        
        const now = this.audioContext.currentTime;
        
        // Jingle bells effect
        for (let i = 0; i < 6; i++) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            const frequencies = [1046.50, 1174.66, 1318.51]; // C6, D6, E6
            oscillator.frequency.setValueAtTime(frequencies[i % 3], now + i * 0.1);
            
            gainNode.gain.setValueAtTime(0, now + i * 0.1);
            gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.2, now + i * 0.1 + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.15);
            
            oscillator.start(now + i * 0.1);
            oscillator.stop(now + i * 0.1 + 0.15);
        }
    }

    /**
     * Set master volume (0 to 1)
     */
    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Clean up audio context
     */
    destroy() {
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }
}

