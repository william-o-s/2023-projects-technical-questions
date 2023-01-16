import { SetStateAction, Dispatch, FormEvent } from "react";
import { TableContents } from "../Table/Table";

interface AlertModalProps {
  useContents: Dispatch<SetStateAction<TableContents>>,
}

export default function AlertModal({useContents}: AlertModalProps) {
  function onSubmitEvent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // hint: the alert given is at (e.target as any).elements[0].value - ignore typescript being annoying
    //console.log((e.target as any).elements[0].value);

    /**
     * First thoughts:
     *  - The main app page renders a Table, and the state of the existing table of contents is kept
     *  within Table.tsx with a useContents hook defined for accessing the table contents. The
     *  onSubmitEvent should then take the alert text and update the contents state to add to the
     *  table.
     *  - I had to refer to these for identifying the type of useContents and how to use them:
     *  https://stackoverflow.com/questions/71324797/react-typescript-what-does-dispatchsetstateactionboolean-stand-for
     *  https://stackoverflow.com/questions/55342406/updating-and-merging-state-object-using-react-usestate-hook
     *  then a bit of experimenting to get the contents state updated. I'm sure there's a simpler
     *  way to combine all the statements into a single line, but as of now, going by the rules of
     *  the useState hook, this is my solution.
     * Closing thoughts:
     *  - Much less difficult than I anticipated, but still tricky to get right. Great question!
     */
    useContents(prevContents => {
      const newContents = { ...prevContents };
      newContents.rowContents.push({
        alert: (e.target as any).elements[0].value as string,
        status: '',
        updates: []
      });

      return newContents;
    })
  }
  
  return (
    <form data-testid='form' onSubmit={onSubmitEvent}>
      <label> Add new alert: </label>
      <input type='text' id='alert' name='alert' />
      <button type='submit'> Add </button>
    </form>
  )
}
