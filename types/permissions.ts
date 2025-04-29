export enum PermissionName {
  // Full permissions
  FullAccess = "FullAccess",

  // Menu permissions
  ViewMenu = "ViewMenu",
  CreateMenu = "CreateMenu",
  UpdateMenu = "UpdateMenu",
  DeleteMenu = "DeleteMenu",

  // Campaign permissions
  ViewCampaigns = "ViewCampaigns",
  CreateCampaigns = "CreateCampaigns",
  UpdateCampaigns = "UpdateCampaigns",
  DeleteCampaigns = "DeleteCampaigns",

  // Order permissions
  ViewOrders = "ViewOrders",
  CreateOrders = "CreateOrders",
  UpdateOrderStatus = "UpdateOrderStatus",
  DeleteOrders = "DeleteOrders",

  // Inventory permissions
  ViewInventory = "ViewInventory",
  AddInventory = "AddInventory",
  UpdateInventory = "UpdateInventory",

  // Staff/User permissions
  ViewUsers = "ViewUsers",
  CreateUsers = "CreateUsers",
  EditUsers = "EditUsers",
  DeleteUsers = "DeleteUsers",

  // Customer permissions
  ViewCustomers = "ViewCustomers",
  EditCustomers = "EditCustomers",
  ManageLoyalty = "ManageLoyalty",

  // Table permissions
  ViewTables = "ViewTables",
  CreateTables = "CreateTables",
  UpdateTables = "UpdateTables",
  ManageReservations = "ManageReservations",

  // Financial permissions
  ViewFinancials = "ViewFinancials",
  ViewExpenses = "ViewExpenses",
  ManageExpenses = "ManageExpenses",
  ViewReports = "ViewReports",

  // Settings permissions
  ManageCampaigns = "ManageCampaigns",

  // KDS permissions
  ViewKDS = "ViewKDS",
  UpdateKDS = "UpdateKDS",

  // Review permissions
  ViewReviews = "ViewReviews",
  ManageReviews = "ManageReviews",
}

export const permissionGroups = {
  Menu: [
    PermissionName.ViewMenu,
    PermissionName.CreateMenu,
    PermissionName.UpdateMenu,
    PermissionName.DeleteMenu,
  ],
  Campaigns: [
    PermissionName.ViewCampaigns,
    PermissionName.CreateCampaigns,
    PermissionName.UpdateCampaigns,
    PermissionName.DeleteCampaigns,
  ],
  Orders: [
    PermissionName.ViewOrders,
    PermissionName.CreateOrders,
    PermissionName.UpdateOrderStatus,
    PermissionName.DeleteOrders,
  ],
  Inventory: [
    PermissionName.ViewInventory,
    PermissionName.AddInventory,
    PermissionName.UpdateInventory,
  ],
  Staff: [
    PermissionName.ViewUsers,
    PermissionName.CreateUsers,
    PermissionName.EditUsers,
    PermissionName.DeleteUsers,
  ],
  Customers: [
    PermissionName.ViewCustomers,
    PermissionName.EditCustomers,
    PermissionName.ManageLoyalty,
  ],
  Tables: [
    PermissionName.ViewTables,
    PermissionName.CreateTables,
    PermissionName.UpdateTables,
    PermissionName.ManageReservations,
  ],
  Financial: [
    PermissionName.ViewFinancials,
    PermissionName.ViewExpenses,
    PermissionName.ManageExpenses,
    PermissionName.ViewReports,
  ],
  Settings: [PermissionName.ManageCampaigns],
  KDS: [PermissionName.ViewKDS, PermissionName.UpdateKDS],
  Reviews: [PermissionName.ViewReviews, PermissionName.ManageReviews],
};

export type Role = "Admin" | "Manager" | "Staff" | "KitchenStaff" | "Waiter" | "Other";

export const roleOptions: Role[] = [
  "Manager",
  "Staff",
  "KitchenStaff",
  "Waiter",
  "Other",
];
