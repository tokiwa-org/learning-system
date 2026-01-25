import * as React from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className = "" }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`flex border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger: React.FC<{ 
  value: string; 
  children: React.ReactNode;
  className?: string;
}> = ({ value, children, className = "" }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");
  
  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 font-medium transition-colors border-b-2 ${
        isActive
          ? "border-gray-900 text-gray-900"
          : "border-transparent text-gray-600 hover:text-gray-900"
      } ${className}`}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<{ 
  value: string; 
  children: React.ReactNode;
  className?: string;
}> = ({ value, children, className = "" }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");
  
  const { activeTab } = context;
  if (activeTab !== value) return null;

  return <div className={className}>{children}</div>;
};