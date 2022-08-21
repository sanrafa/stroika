interface Column {
  columnId: string;
  columnName: string;
  order: number;
  categories?: [];
}

const testColumns: Column[] = [
  {
    columnId: "col1",
    columnName: "TO DO",
    order: 1,
  },
  {
    columnId: "col2",
    columnName: "DOING",
    order: 2,
  },
  {
    columnId: "col3",
    columnName: "DONE",
    order: 3,
  },
];

export default testColumns;
