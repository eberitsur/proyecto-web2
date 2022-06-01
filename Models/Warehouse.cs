﻿using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace APIReactAuth.Models
{
    public partial class Warehouse
    {
        public Warehouse()
        {
            MovementOriginWarehouses = new HashSet<Movement>();
            MovementTargetWarehouses = new HashSet<Movement>();
            Warehouseproducts = new HashSet<Warehouseproduct>();
        }

        public int WarehouseId { get; set; }
        public string Description { get; set; } = null!;
        public string? Address { get; set; }
        public int CompanyId { get; set; }

        //[JsonIgnore]
        //public virtual Company Company { get; set; } = null!;
        public virtual ICollection<Movement> MovementOriginWarehouses { get; set; }
        public virtual ICollection<Movement> MovementTargetWarehouses { get; set; }
        public virtual ICollection<Warehouseproduct> Warehouseproducts { get; set; }
    }
}
