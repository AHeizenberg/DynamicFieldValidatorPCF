import * as React from "react";
import { TextField as FluentTextField } from "@fluentui/react/lib/TextField";
import { Label } from "@fluentui/react/lib/Label";
import Dropdown from "./Dropdown";

export interface TextFieldProps {
  placeholder?: string; // Placeholder text for the input field
  header?: string; // Header text for the dropdown
  headerFontColor?: string; // Color of the header text
  maxHeight?: string; // Maximum height of the dropdown
  filterColumn?: string; // Column name to filter on
  identifierColumn?: string; // Column used as an identifier in API responses
  userInput?: string; // Initial user input
  pluralTableLogicalName: string; // Table logical name
  filterType: string; // Filter type (e.g., 'or', 'and')
  duplicteDetectedMessage: string; // Message to display when a duplicate is detected
  noMatchesFoundMessage: string; // Message to display when no matches are found
  partialMatchMessage: string; // Message to display when partial matches are found
  onAccountsFetched: (hasSimilarAccounts: boolean, userInput: string) => void;
}

interface ApiAccount {
  [key: string]: any; // Index signature to allow accessing properties using variable keys
}

interface RetrieveMultipleResult {
  entities: ApiAccount[];
}

interface AccountItem {
  name: string;
  id: string;
}

const TextField: React.FC<TextFieldProps> = ({
  placeholder,
  header,
  headerFontColor,
  maxHeight,
  filterColumn,
  identifierColumn,
  userInput,
  pluralTableLogicalName,
  filterType,
  duplicteDetectedMessage,
  noMatchesFoundMessage,
  partialMatchMessage,
  onAccountsFetched,
}) => {
  const [inputValue, setInputValue] = React.useState(userInput || "");
  const [isDropdownVisible, setIsDropdownVisible] = React.useState(false);
  const [items, setItems] = React.useState<AccountItem[]>([]);
  const [footerText, setFooterText] = React.useState("");
  const [borderColor, setBorderColor] = React.useState("black");
  const [referenceElement, setReferenceElement] =
    React.useState<Element | null>(null);

  const handleChange = async (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    const value = newValue || "";
    setInputValue(value);
    if (value.length > 0) {
      await fetchAccounts(value);
    } else {
      setItems([]);
      setInputValue("");
      setIsDropdownVisible(false);
      setFooterText(noMatchesFoundMessage);
      setBorderColor("green");
    }
  };

  const createINSearchQuery = (searchQuery: string, joinType: string) => {
    const searchTerms = searchQuery.split(" ");
    return searchTerms
      .map((term) => `contains(${filterColumn},'${term}')`)
      .join(` ${joinType} `);
  };

  const fetchAccounts = async (searchQuery: string) => {
    setIsDropdownVisible(true);
    const filterQuery = createINSearchQuery(searchQuery, filterType);
    const query = `?$filter=${filterQuery}&$select=${filterColumn},${identifierColumn}`;

    try {
      const response: RetrieveMultipleResult =
        await Xrm.WebApi.retrieveMultipleRecords(pluralTableLogicalName, query);
      const accountNames = response.entities.map((item: ApiAccount) => ({
        name: item[filterColumn as string] ?? "Unknown",
        id: item[identifierColumn as string] ?? "No ID",
      }));
      setItems(accountNames);
      console.log("Fetched accounts:", accountNames);

      if (accountNames.length > 0) {
        setFooterText(partialMatchMessage);
        setBorderColor("orange");
      } else {
        setFooterText(noMatchesFoundMessage);
        setBorderColor("green");
      }
    } catch (error) {
      console.error("Error fetching:", error);
      setFooterText("Failed to fetch data");
      setBorderColor("red");
      setIsDropdownVisible(false);
    }
  };

  const handleBlur = () => {
    setIsDropdownVisible(false);
    if (
      items.find(
        (item) =>
          item.name.toLocaleLowerCase() === inputValue.toLocaleLowerCase()
      )
    ) {
      setFooterText(duplicteDetectedMessage);
      setBorderColor("red");
      onAccountsFetched(true, inputValue);
    } else {
      onAccountsFetched(false, inputValue);
    }
  };

  return (
    <div ref={setReferenceElement} style={{ width: "100%" }}>
      <FluentTextField
        placeholder={placeholder}
        value={inputValue}
        onFocus={() => setIsDropdownVisible(true)}
        onBlur={handleBlur}
        onChange={handleChange}
        styles={{ fieldGroup: { borderColor } }}
      />
      <Label
        style={{
          color: borderColor,
          fontSize: "12px",
          paddingLeft: "2px",
          textAlign: "left",
          display: !isDropdownVisible ? "block" : "none",
        }}
      >
        {footerText}
      </Label>
      {isDropdownVisible && items.length > 0 && (
        <Dropdown
          referenceElement={referenceElement}
          items={items}
          header={header}
          headerFontColor={headerFontColor}
          width="100%" // Assume full width for simplicity, adjust if needed
          maxHeight={maxHeight}
        />
      )}
    </div>
  );
};

export default TextField;
