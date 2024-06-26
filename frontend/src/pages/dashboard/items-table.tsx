import { useEffect, useState } from "react";
import {
  Box,
  SpaceBetween,
  TableProps,
  Header,
  Table,
  StatusIndicator,
} from "@cloudscape-design/components";
import RouterButton from "../../components/wrappers/router-button";
import RouterLink from "../../components/wrappers/router-link";
import { TextHelper } from "../../common/helpers/text-helper";
import { Memo } from "../../common/types";
import { API } from 'aws-amplify';

const ItemsColumnDefinitions: TableProps.ColumnDefinition<Memo>[] = [
  {
    id: "name",
    header: "Name",
    sortingField: "name",
    cell: (item) => (
      <RouterLink href={`/section1/items/${item.SK}`}>
        {item.name}
      </RouterLink>
    ),
    isRowHeader: true,
  },
  {
    id: "type",
    header: "Type",
    sortingField: "type",
    cell: (item) => item.type,
  },
  {
    id: "starus",
    header: "Status",
    sortingField: "status",
    cell: (item) => (
      <StatusIndicator type={item.status}>{item.status}</StatusIndicator>
    ),
    minWidth: 120,
  },
  {
    id: "details",
    header: "Details",
    sortingField: "details",
    cell: (item) => item.details,
  },
];

export default function ItemsTable() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Memo[]>([]);
  const [selectedItems, setSelectedItems] = useState<Memo[]>([]);

  useEffect(() => {
    (async () => {
      const response = await API.get('main', '/memo', {});
      setItems(response.memos);
      setLoading(false);
    })();
  }, []);

  return (
    <Table
      loading={loading}
      loadingText="Loading Items"
      selectionType="single"
      empty={
        <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
          <SpaceBetween size="xxs">
            <div>
              <b>No Items</b>
              <Box variant="p" color="inherit">
                Item is a thing that is used to do something.
              </Box>
            </div>
            <RouterButton href="/section1/add">Add Item</RouterButton>
          </SpaceBetween>
        </Box>
      }
      columnDefinitions={ItemsColumnDefinitions}
      items={items.slice(0, 5)}
      selectedItems={selectedItems}
      onSelectionChange={(event: {
        detail: TableProps.SelectionChangeDetail<Memo>;
      }) => setSelectedItems(event.detail.selectedItems)}
      header={
        <Header
          counter={
            !loading
              ? TextHelper.getHeaderCounterText(items, selectedItems)
              : undefined
          }
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <RouterButton
                disabled={selectedItems.length !== 1}
                href={`/section1/items/${
                  selectedItems.length > 0 ? selectedItems[0].SK : ""
                }`}
              >
                View
              </RouterButton>
              <RouterButton href="/section1/add">Add Item</RouterButton>
            </SpaceBetween>
          }
        >
          Items
        </Header>
      }
      footer={
        <Box textAlign="center">
          <RouterLink href="/section1">View all Items</RouterLink>
        </Box>
      }
    />
  );
}
