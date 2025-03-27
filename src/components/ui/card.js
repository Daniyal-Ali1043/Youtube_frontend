// src/components/ui/card.js
export function Card({ children }) {
    return (
      <div className="rounded-2xl shadow-md p-4 bg-white dark:bg-gray-800">
        {children}
      </div>
    );
  }
  
  export function CardContent({ children }) {
    return <div>{children}</div>;
  }
  