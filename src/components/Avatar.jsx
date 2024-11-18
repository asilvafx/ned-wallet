import React, { useEffect } from 'react';
import RetroAvatarGenerator from '../utils/RetroAvatarGenerator';

const Avatar = ({ id = 0, size = 32, round = false, density = 1 }) => {
    useEffect(() => {
        const avatarGenerator = new RetroAvatarGenerator();
        return () => {
            // Cleanup if necessary (e.g., remove event listeners or clean up DOM)
        };
    }, []);

    return (
        <span
            className="retro-avatar"
            data-retro-id={id}
            data-retro-size={size}
            data-round={round ? '1' : '0'}
            data-density={density}
        />
    );
};

export default Avatar;