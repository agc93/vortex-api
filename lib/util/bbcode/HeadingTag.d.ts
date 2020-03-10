import { Tag } from 'bbcode-to-react';
declare class HeadingTag extends Tag {
    toHTML(): string[];
    toReact(): JSX.Element;
}
export default HeadingTag;