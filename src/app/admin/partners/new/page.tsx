import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PartnerCreateForm } from "@/components/admin/partner-create-form";

export const metadata = { title: "New partner" };

export default function NewPartnerPage() {
  return (
    <div className="mx-auto max-w-[840px] px-6 py-8">
      <AdminPageHeader
        title="New partner"
        description="Create a new 3PL partner listing. You can edit all other details after creating."
      />
      <div className="mt-6">
        <PartnerCreateForm />
      </div>
    </div>
  );
}
