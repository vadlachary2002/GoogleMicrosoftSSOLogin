import React from 'react';

type TextSize = 'small' | 'normal' | 'medium' | 'large';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
    size?: TextSize;
    weight?: React.CSSProperties['fontWeight'];
    color?: string;
    children?: React.ReactNode;
}

const Text: React.FC<TextProps> = ({
                                       size = 'normal',
                                       weight = 'normal',
                                       color = '#000000',
                                       children,
                                       style = {},
                                       ...props
                                   }) => {
    const sizeMap: Record<TextSize, string> = {
        small: '12px',
        normal: '14px',
        medium: '16px',
        large: '20px',
    };

    return (
        <p
            style={{
                fontSize: sizeMap[size],
                fontWeight: weight,
                color,
                margin: 0,
                ...style,
            }}
            {...props}
        >
            {children}
        </p>
    );
};

export default Text;
