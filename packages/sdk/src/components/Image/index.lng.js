import { Utils, Lightning } from '@lightningjs/sdk';
export default class Image extends Lightning.Component {
    static _template() {
        return {
            color: 0xffffffff,
            w: 0,
            h: 0
        };
    }

    set source(src) {
        this._source = src;
        this._update();
    }

    _init() {
        this._update();
    }

    _update() {
        const { _source, w, h } = this;
        const template = getIconTemplate(_source, w, h);

        this.patch(template);
    }
}

const [isSvgTag, isSvgURI, isImageURI] = [
    /^<svg.*<\/svg>$/,
    /\.svg$/,
    /\.(a?png|bmp|gif|ico|cur|jpe?g|pjp(eg)?|jfif|tiff?|webp)$/
].map(regex => RegExp.prototype.test.bind(regex));

function getIconTemplate(icon, w, h) {
    const template = { w, h };

    switch (true) {
        case isSvgTag(icon):
            template.texture = Lightning.Tools.getSvgTexture(
                `data:image/svg+xml,${encodeURIComponent(icon)}`,
                w,
                h
            );
            break;
        case isSvgURI(icon):
            template.texture = Lightning.Tools.getSvgTexture(icon, w, h);
            break;  
        case isImageURI(icon):
            template.src = icon.indexOf('http://') === 0 || icon.indexOf('https://') === 0 ? icon : Utils.asset(icon);
            break;
        default:
            break;
    }
    return template;
}