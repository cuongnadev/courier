import CollectionSidebar from "@/features/collections/components/collection-sidebar/collection-sidebar";

export default function CollectionsPage() {
  return (
    <div className="flex h-full">
      <CollectionSidebar />
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold">Collections</h1>
        <p>Welcome to the Collections page!</p>
      </div>
    </div>
  );
}