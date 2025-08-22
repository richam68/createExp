import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FilterTabs = ({ activeTab, onTabChange }) => {
  const tabOptions = [
    { value: "all", label: "All" },
    { value: "individual", label: "Individual" },
    { value: "company", label: "Company" },
  ];

  return (
    <div className="p-4 sm:p-6 border-b">
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          {tabOptions?.map(({ value, label }) => (
            <TabsTrigger key={value} value={value} className="text-sm">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default FilterTabs;
