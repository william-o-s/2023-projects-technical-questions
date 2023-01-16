/* eslint-disable react/jsx-key */

import { useState } from "react";
import AlertModal from "../AlertModal";
import styles from "./Table.module.css";

// !!!!!!!!!!!!!!!!!!!!
// TODO is at line 68 !
// !        Ok        !
// !!!!!!!!!!!!!!!!!!!!

interface AlertUpdate {
  date: string,
  update: string
}

interface Alert {
  alert: string,
  status: string,
  updates: AlertUpdate[]
}

export interface TableContents {
  columnTitles: string[],
  rowContents: Alert[]
}

export default function Table() {
  const [contents, useContents] = useState<TableContents>({
    columnTitles: ['Alert', 'Status', 'Updates'],
    rowContents: [
      {
        alert: 'food',
        status: 'good!',
        updates: []
      },
      {
        alert: 'water',
        status: 'low',
        updates: [{ update: 'dropped to 10% below normal', date: '11/11/2022' }]
      },
      {
        alert: 'shelter',
        status: 'terrible :(',
        updates: [{ update: 'slept on cold ground', date: '11/11/2022' }, { update: 'slept on hard concrete', date: '13/11/2022' }]
      },
      {
        alert: 'Done!',
        status: 'william-o-s',
        updates: [{ update: 'hungry', date: '16/01/2023' }]
      }
    ]
  });

  /**
   * First thoughts:
   *  - This seems to be a straightforward table: each row has 3 columns, and each column contains a
   *  property of each alert. We can, similar to columnTitles, iterate over each update and render a
   *  div containing the update.
   *  - The problem is the flex properties. The .item class flexes as a column, so it can't be used
   *  for individual divs as this would align the date below the update text. Thus, a new CSS class
   *  .updateRow will be defined so each update aligns the text and date side-by-side.
   *  - Finally, the date item must be a smaller, blue font, to the right of the update text, at the
   *  the bottom of the container. By making a .dateItem class that is also a flexbox, this can be
   *  done.
   *
   * Closing thoughts:
   *  - The only changes made were:
   *    components/Table/Table.tsx - lines 82-83, adding an index key
   *    components/Table/Table.tsx - lines 92-99, adding the update items
   *    components/Table/Table.module.css - lines 22-40, adding CSS classes
   *  - This FE challenge was tricky to get right due to the properties of flexboxes, and using this
   *  link was crucial: https://css-tricks.com/snippets/css/a-guide-to-flexbox/. A lot of
   *  experimentation also occurred with different flex properties before the correct ones were used
   *  to get the solution. Thanks!
   */
  return (
    <>
      <AlertModal useContents={useContents} />
      <div className={styles.myTable}>
        <div className={styles.row}>
          {contents.columnTitles.map((item) => <div className={styles.item} key={item}>{item}</div>)}
        </div>
        {contents.rowContents.map((content, index) => (
          <div data-testid='row' className={styles.row} key={index}>
            <div className={styles.item}>
              {content.alert}
            </div>
            <div className={styles.item}>
              {content.status}
            </div>
            <div className={styles.item}>
              {
                content.updates.map((update, index) => 
                  <div className={styles.updateRow} key={index}>
                    <>{update.update}</>
                    <div className={styles.dateItem}>{update.date}</div>
                  </div>
                )
              }
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
