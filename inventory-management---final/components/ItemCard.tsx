import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreVertical, Edit, Trash, EyeOff, Flame, History, Pin, ArrowUpFromLine, ArrowDownToLine, Package, ListChecks, Link2Off } from 'lucide-react';
import Image from "next/image";
import { ItemWithSizeCount } from '@/hooks/useItems';
import { ItemSize } from '@/lib/api/items';
import { Promoter } from '@/lib/api/promoters';

interface ItemCardProps {
  item: ItemWithSizeCount;
  itemSizes: Record<string, ItemSize[]>;
  isPinned: (id: string) => boolean;
  isMassEditMode: boolean;
  itemQuantities: { [key: string]: { sizeId: string; quantity: number } };
  selectedAction: string | null;
  selectedPromoter: Promoter | null;
  handleEdit: (item: ItemWithSizeCount) => void;
  handleToggleInactive: (id: string) => void;
  handleTogglePin: (id: string) => void;
  handleShowHistory: (item: ItemWithSizeCount) => void;
  handleDeleteClick: (item: ItemWithSizeCount) => void;
  stopSharingItem: (id: string) => Promise<void>; // Assuming async based on name
  handleQuantityChange: (item: ItemWithSizeCount, action: string) => void;
  handleMassEditQuantityChange: (itemId: string, quantity: number) => void;
  handleMassEditSizeChange: (itemId: string, sizeId: string) => void;
  showActions?: boolean;
  showMenu?: boolean;
}

export default function ItemCard({
  item,
  itemSizes,
  isPinned,
  isMassEditMode,
  itemQuantities,
  selectedAction,
  selectedPromoter,
  handleEdit,
  handleToggleInactive,
  handleTogglePin,
  handleShowHistory,
  handleDeleteClick,
  stopSharingItem,
  handleQuantityChange,
  handleMassEditQuantityChange,
  handleMassEditSizeChange,
  showActions = true, // Default to true
  showMenu = true,   // Default to true
}: ItemCardProps) {
  return (
    <Card key={item.id} className={`overflow-hidden ${!item.is_active ? 'opacity-60' : ''} transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary`}>
      <CardContent className="p-0">
        <div className="relative">
          <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                width={160}
                height={160}
                className="object-contain h-full w-full transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <div className="text-gray-400 text-xl">No Image</div>
            )}
            {isPinned(item.id) && (
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
                <Pin size={16} />
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                <p className="text-sm text-gray-500 truncate">ID: {item.product_id}</p>
              </div>
              {!isMassEditMode && showMenu && ( // Conditionally render menu
                <div className="flex items-center space-x-1 flex-shrink-0">
                  {item.is_shared_instance && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        stopSharingItem(item.id);
                      }}
                      title="Stop sharing this item in this brand"
                    >
                      <Link2Off size={16} />
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="bottom" alignOffset={-5} sideOffset={5}>
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Edit className="mr-2" size={16} />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleInactive(item.id)}>
                        <EyeOff className="mr-2" size={16} />
                        {item.is_active ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTogglePin(item.id)}>
                        <Pin className="mr-2" size={16} />
                        {isPinned(item.id) ? 'Unpin' : 'Pin'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShowHistory(item)}>
                        <History className="mr-2" size={16} />
                        History
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(item);
                      }}>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Löschen</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Original:</p>
                <p>{item.quantities?.originalQuantity || 0}</p>
              </div>
              <div>
                <p className="text-gray-500">Available:</p>
                <p>{item.quantities?.availableQuantity || 0}</p>
              </div>
              <div>
                <p className="text-gray-500">In Circulation:</p>
                <p>{item.quantities?.inCirculation || 0}</p>
              </div>
              <div>
                <p className="text-gray-500">Total:</p>
                <p>{item.quantities?.totalQuantity || 0}</p>
              </div>
            </div>

            {isMassEditMode ? (
              <div className="mt-4 space-y-2">
                {(itemSizes[item.id]?.length || 0) > 1 ? (
                  <Select
                    value={itemQuantities[item.id]?.sizeId || ""}
                    onValueChange={(value) => handleMassEditSizeChange(item.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Größe wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {(itemSizes[item.id] || []).map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.size} ({selectedAction === 'take-out' ?
                            `Verfügbar: ${size.available_quantity}` :
                            `Im Umlauf: ${size.in_circulation}`})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {itemSizes[item.id]?.[0]?.size || 'Einheitsgröße'}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max={(() => {
                      const size = itemSizes[item.id]?.find(s => s.id === itemQuantities[item.id]?.sizeId);
                      if (!size) return 0;
                      return selectedAction === 'take-out' ? size.available_quantity :
                             selectedAction === 'return' || selectedAction === 'burn' ? size.in_circulation : 0;
                    })()}
                    value={itemQuantities[item.id]?.quantity || ''}
                    onChange={(e) => handleMassEditQuantityChange(item.id, parseInt(e.target.value) || 0)}
                    placeholder="Menge"
                    disabled={!selectedAction || !selectedPromoter || !itemQuantities[item.id]?.sizeId ||
                              (selectedAction === 'take-out' &&
                               (itemSizes[item.id]?.find(s => s.id === itemQuantities[item.id]?.sizeId)?.available_quantity || 0) <= 0) ||
                              ((selectedAction === 'return' || selectedAction === 'burn') &&
                               (itemSizes[item.id]?.find(s => s.id === itemQuantities[item.id]?.sizeId)?.in_circulation || 0) <= 0)}
                  />
                </div>
              </div>
            ) : (
              showActions && ( // Conditionally render actions
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item, 'take-out')}
                    disabled={!item.is_active || (item.quantities?.availableQuantity || 0) <= 0}
                    className="border-2 border-red-500 bg-transparent hover:bg-transparent hover:border-red-600 text-red-500 hover:text-red-600"
                  >
                    <ArrowUpFromLine className="mr-1" size={14} />
                    Take Out
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item, 'return')}
                    disabled={!item.is_active || (item.quantities?.inCirculation || 0) <= 0}
                    className="border-2 border-green-500 bg-transparent hover:bg-transparent hover:border-green-600 text-green-500 hover:text-green-600"
                  >
                    <ArrowDownToLine className="mr-1" size={14} />
                    Return
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item, 'burn')}
                    disabled={!item.is_active || (item.quantities?.inCirculation || 0) <= 0}
                  >
                    <Flame className="mr-1" size={14} />
                    Burn
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item, 'restock')}
                    disabled={!item.is_active}
                  >
                    <Package className="mr-1" size={14} />
                    Restock
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 