import { BreadcrumbGroup } from "@cloudscape-design/components";
import { APP_NAME } from "../../../common/constants";
import { useOnFollow } from "../../../common/hooks/use-on-follow";
import BaseAppLayout from "../../../components/base-app-layout";
import AllItemsTable from "./all-items-table";

export default function ContactsPage() {
  const onFollow = useOnFollow();

  return (
    <BaseAppLayout
      breadcrumbs={
        <BreadcrumbGroup
          onFollow={onFollow}
          items={[
            {
              text: APP_NAME,
              href: "/",
            },
            {
              text: "Contacts",
              href: "/contacts",
            },
          ]}
        />
      }
      content={<AllItemsTable />}
    />
  );
}
