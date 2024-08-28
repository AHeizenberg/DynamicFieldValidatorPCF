import * as React from "react";
import { usePopper } from "react-popper";
import { Label as FluentLabel } from "@fluentui/react/lib/Label";

interface DropdownProps {
  referenceElement: Element | null;
  items: DropdownItems[];
  header?: string;
  headerFontColor?: string;
  width?: string; // Width can be any valid CSS value (e.g., '100%', '300px')
  maxHeight?: string; // MaxHeight can be any valid CSS value (e.g., '300px')
}

interface DropdownItems {
  name: string;
  id: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  referenceElement,
  items,
  header,
  headerFontColor,
  width,
  maxHeight,
}) => {
  const [popperElement, setPopperElement] =
    React.useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, -5], // Adjust the Y offset
        },
      },
    ],
  });

  return (
    <div
      ref={setPopperElement}
      style={{
        backgroundColor: "white",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        borderRadius: "4px",
        padding: "10px",
        marginTop: "5px",
        zIndex: 9999,
        width: "250px",
        maxHeight: maxHeight,
        overflowY: "scroll",
        textAlign: "left", // Ensure text is left-aligned
        ...styles.popper, // Apply styles from usePopper
      }}
      {...attributes.popper} // Apply attributes (like 'data-popper-placement') from usePopper
    >
      {header && (
        <FluentLabel style={{ color: headerFontColor, marginBottom: "3px" }}>
          {header}
        </FluentLabel>
      )}
      {items.map((item, index) => (
        <FluentLabel key={index} style={{ padding: "5px 0" }}>
          {item.name}
        </FluentLabel>
      ))}
    </div>
  );
};

export default Dropdown;
