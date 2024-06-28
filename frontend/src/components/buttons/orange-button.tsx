import { MouseEvent } from 'react';
import { TinyColor } from '@ctrl/tinycolor';
import { Button, ConfigProvider } from 'antd';

const colors2 = ['#fc6076', '#ff9a44', '#ef9d43', '#e75516'];

const getHoverColors = (colors: string[]) =>
    colors.map((color) => new TinyColor(color).lighten(5).toString());
const getActiveColors = (colors: string[]) =>
    colors.map((color) => new TinyColor(color).darken(5).toString());

export const OrangeButton = ({
    title,
    handleClick,
}: {
    title: string;
    handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
}) => {
    return (
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        colorPrimary: `linear-gradient(135deg, ${colors2.join(', ')})`,
                        colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(colors2).join(', ')})`,
                        colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(colors2).join(', ')})`,
                        lineWidth: 0,
                    },
                },
            }}
        >
            <Button
                type="primary"
                size="large"
                style={{ width: '100%' }}
                onClick={handleClick}
            >
                {title}
            </Button>
        </ConfigProvider>
    );
};
