import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

// Context for sharing state between Select components
const SelectContext = React.createContext();

const Select = ({ children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const contextValue = {
    value,
    onValueChange,
    isOpen,
    setIsOpen
  };

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  
  if (!context) {
    throw new Error('SelectTrigger must be used within a Select component');
  }
  
  const { isOpen, setIsOpen } = context;

  return (
    <button
      ref={ref}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = ({ placeholder }) => {
  const context = React.useContext(SelectContext);
  
  if (!context) {
    throw new Error('SelectValue must be used within a Select component');
  }
  
  const { value } = context;
  
  return <span>{value || placeholder}</span>;
};

const SelectContent = ({ children, ...props }) => {
  const context = React.useContext(SelectContext);
  
  if (!context) {
    throw new Error('SelectContent must be used within a Select component');
  }
  
  const { isOpen } = context;
  
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover text-popover-foreground shadow-md">
      <div className="max-h-60 overflow-auto p-1" {...props}>
        {children}
      </div>
    </div>
  );
};

const SelectItem = ({ value, children, ...props }) => {
  const context = React.useContext(SelectContext);
  
  if (!context) {
    throw new Error('SelectItem must be used within a Select component');
  }
  
  const { onValueChange, setIsOpen, value: selectedValue } = context;
  
  const handleClick = () => {
    if (onValueChange) {
      onValueChange(value);
    }
    setIsOpen(false);
  };

  return (
    <div
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        selectedValue === value && "bg-accent text-accent-foreground"
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
};

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };