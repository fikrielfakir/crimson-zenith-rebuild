import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Mail, Archive, Eye, EyeOff, MoreVertical, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";

interface BulkOperationsProps {
  items: any[];
  selectedItems: string[];
  onSelectionChange: (selected: string[]) => void;
  entityType: "clubs" | "events" | "users" | "articles";
}

export const BulkOperations = ({ 
  items, 
  selectedItems, 
  onSelectionChange,
  entityType 
}: BulkOperationsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>("");

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(items.map(item => item.id));
    }
  };

  const handleToggleItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onSelectionChange(selectedItems.filter(id => id !== itemId));
    } else {
      onSelectionChange([...selectedItems, itemId]);
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedItems.length === 0) {
      toast.error("No items selected", {
        description: "Please select at least one item to perform bulk actions."
      });
      return;
    }

    setBulkAction(action);

    switch (action) {
      case "delete":
        setShowDeleteDialog(true);
        break;
      case "activate":
        performBulkActivate();
        break;
      case "deactivate":
        performBulkDeactivate();
        break;
      case "email":
        performBulkEmail();
        break;
      case "archive":
        performBulkArchive();
        break;
      default:
        break;
    }
  };

  const performBulkDelete = () => {
    // Simulate bulk delete
    toast.success(`${selectedItems.length} ${entityType} deleted`, {
      description: "The selected items have been removed successfully."
    });
    onSelectionChange([]);
    setShowDeleteDialog(false);
  };

  const performBulkActivate = () => {
    toast.success(`${selectedItems.length} ${entityType} activated`, {
      description: "The selected items are now active."
    });
    onSelectionChange([]);
  };

  const performBulkDeactivate = () => {
    toast.success(`${selectedItems.length} ${entityType} deactivated`, {
      description: "The selected items have been deactivated."
    });
    onSelectionChange([]);
  };

  const performBulkEmail = () => {
    toast.success(`Email sent to ${selectedItems.length} ${entityType}`, {
      description: "Bulk email campaign initiated successfully."
    });
    onSelectionChange([]);
  };

  const performBulkArchive = () => {
    toast.success(`${selectedItems.length} ${entityType} archived`, {
      description: "The selected items have been moved to archives."
    });
    onSelectionChange([]);
  };

  const isAllSelected = selectedItems.length === items.length && items.length > 0;
  const isSomeSelected = selectedItems.length > 0 && selectedItems.length < items.length;

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Bulk Operations</CardTitle>
              <CardDescription>
                {selectedItems.length > 0 
                  ? `${selectedItems.length} ${entityType} selected`
                  : "Select items to perform bulk actions"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="gap-2"
              >
                {isAllSelected ? (
                  <>
                    <CheckSquare className="h-4 w-4" />
                    Deselect All
                  </>
                ) : (
                  <>
                    <Square className="h-4 w-4" />
                    Select All
                  </>
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="default" 
                    size="sm"
                    disabled={selectedItems.length === 0}
                    className="gap-2"
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="hidden sm:inline">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleBulkAction("activate")} className="gap-2">
                    <Eye className="h-4 w-4" />
                    Activate Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("deactivate")} className="gap-2">
                    <EyeOff className="h-4 w-4" />
                    Deactivate Selected
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {entityType === "users" && (
                    <DropdownMenuItem onClick={() => handleBulkAction("email")} className="gap-2">
                      <Mail className="h-4 w-4" />
                      Send Bulk Email
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleBulkAction("archive")} className="gap-2">
                    <Archive className="h-4 w-4" />
                    Archive Selected
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction("delete")} 
                    className="gap-2 text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {selectedItems.length > 0 && (
              <>
                <Badge variant="secondary" className="gap-1">
                  {selectedItems.length} selected
                </Badge>
                {items
                  .filter(item => selectedItems.includes(item.id))
                  .slice(0, 3)
                  .map(item => (
                    <Badge key={item.id} variant="outline" className="gap-1">
                      {item.name || item.title}
                    </Badge>
                  ))}
                {selectedItems.length > 3 && (
                  <Badge variant="outline">
                    +{selectedItems.length - 3} more
                  </Badge>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <strong>{selectedItems.length}</strong> {entityType} and remove their data from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={performBulkDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete {selectedItems.length} {entityType}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BulkOperations;
