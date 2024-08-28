import * as React from "react";
import * as ReactDOM from "react-dom";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import TextField from "./components/Textfield";

export class AccountLookup
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private container: HTMLDivElement;
  private notifyOutputChanged: () => void;
  private isFirstLoad: boolean = true;
  private userInput: string;

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    container: HTMLDivElement
  ): void {
    this.container = container;
    context.mode.trackContainerResize(true);
    this.notifyOutputChanged = notifyOutputChanged;
    this.userInput = "";
    this.isFirstLoad = true;
    this.updateView(context);
  }

  public updateView(
    context: ComponentFramework.Context<IInputs>
  ): React.ReactElement {
    const props = {
      /*
      envURL: context.parameters.EnvironmentURL
        ? context.parameters.EnvironmentURL.raw || "test"
        : "test",
      */
      placeholder: context.parameters.PlaceHolderContent
        ? context.parameters.PlaceHolderContent.raw || "Column Value"
        : "Column Value",
      header: context.parameters.headerContent
        ? context.parameters.headerContent.raw ||
          "Similar Items Already Exists!"
        : "Similar Items Already Exists!",
      headerFontColor: context.parameters.headerFontColor
        ? context.parameters.headerFontColor.raw || "#de5246"
        : "#de5246",
      maxHeight: "300px",
      filterColumn: context.parameters.filterColumnLogicalName
        ? context.parameters.filterColumnLogicalName.raw || ""
        : "",
      identifierColumn: context.parameters.identifierColumnLogicalName
        ? context.parameters.identifierColumnLogicalName.raw || ""
        : "",
      userInput:
        this.isFirstLoad && context.parameters.userInput
          ? context.parameters.userInput.raw || ""
          : this.userInput,
      pluralTableLogicalName: context.parameters.pluralTableLogicalName
        ? context.parameters.pluralTableLogicalName.raw || ""
        : "",
      filterType: context.parameters.filterType
        ? context.parameters.filterType.raw || "or"
        : "or",
      duplicteDetectedMessage: context.parameters.duplicteDetectedMessage
        ? context.parameters.duplicteDetectedMessage.raw ||
          "Similar Item Found!"
        : "Similar Item Found!",
      noMatchesFoundMessage: context.parameters.noMatchesFoundMessage
        ? context.parameters.noMatchesFoundMessage.raw ||
          "No Similar Items Found!"
        : "No Similar Items Found!",
      partialMatchMessage: context.parameters.partialMatchMessage
        ? context.parameters.partialMatchMessage.raw ||
          "Some Similar Items Found!"
        : "Some Similar Items Found!",
      onAccountsFetched: this.handleAccountsFetched,
    };

    console.log("props", props);
    console.log("Updateview updated");

    return React.createElement(TextField, props);
  }

  private handleAccountsFetched = (
    DuplicateDetected: boolean,
    userInput: string
  ) => {
    if (!DuplicateDetected) {
      this.isFirstLoad = false;
      this.userInput = userInput;
    } else {
      this.userInput = "";
    }
    this.notifyOutputChanged(); // Call only when no similar accounts are found
  };

  public getOutputs(): IOutputs {
    return { userInput: this.userInput };
  }

  public destroy(): void {
    this.container.innerHTML = ""; // Clean up the container when the component is destroyed
  }
}
