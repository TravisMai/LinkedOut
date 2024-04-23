type DividerWithTextProps = {
    text?: string;
    dividerClassname?: string;
    textClassname?: string;
    className?: string
    noText?: boolean
    muiElementIcon?: JSX.Element
};

const DividerWithText = (props: DividerWithTextProps) => {
    const { text, className = "", dividerClassname = '', textClassname = '', noText = false, muiElementIcon = null } = props;

    return (
        <div className={`w-full flex items-center justify-between ${noText ? "gap-0" : "gap-3"} ${className} `}>
            <hr className={`h-[1px] flex-1 bg-gray-300 ${dividerClassname} ${noText && "w-full"}`} />
            <span className={`${textClassname}`}>
                {text} {muiElementIcon}
            </span>
            <hr className={`h-[1px] flex-1 bg-gray-300 ${dividerClassname}`} />
        </div>
    );
};

export default DividerWithText;