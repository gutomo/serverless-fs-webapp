import {
  Button,
  Header,
  HeaderProps,
  SpaceBetween,
} from "@cloudscape-design/components";
import RouterButton from "../../../components/wrappers/router-button";
import { useNavigate } from "react-router-dom";
import { Memo } from "../../../common/types";
import { useState } from "react";
import ItemDeleteModal from "../../../components/modals/item-delete-modal";
import { API } from 'aws-amplify';

interface AllItemsPageHeaderProps extends HeaderProps {
  title?: string;
  createButtonText?: string;
  selectedItems: readonly Memo[];
  refresh: () => Promise<void>;
}

export function AllItemsPageHeader({
  title = "Items",
  ...props
}: AllItemsPageHeaderProps) {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const onDeleteWorksapce = async () => {
    setShowDeleteModal(false);
    await API.post('main', '/memo/delete', { body: { sk: props.selectedItems[0].SK } });

    setTimeout(async () => {
      await props.refresh();
    }, 2500);
  };

  return (
    <>
      <ItemDeleteModal
        visible={showDeleteModal}
        onDiscard={() => setShowDeleteModal(false)}
        onDelete={onDeleteWorksapce}
        item={props.selectedItems[0]}
      />
      <Header
        variant="awsui-h1-sticky"
        actions={
          <SpaceBetween size="xs" direction="horizontal">
            <Button iconName="refresh" onClick={() => props.refresh()} />
            <RouterButton
              data-testid="header-btn-view-details"
              disabled={props.selectedItems.length !== 1}
              onClick={() =>
                navigate(`/section1/items/${props.selectedItems[0].SK}`)
              }
            >
              View
            </RouterButton>
            <RouterButton
              data-testid="header-btn-view-details"
              disabled={props.selectedItems.length !== 1}
              onClick={onDeleteClick}
            >
              Delete
            </RouterButton>
            <RouterButton
              data-testid="header-btn-create"
              variant="primary"
              href="/section1/add"
            >
              Add Item
            </RouterButton>
          </SpaceBetween>
        }
        {...props}
      >
        {title}
      </Header>
    </>
  );
}
