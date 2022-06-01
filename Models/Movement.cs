﻿using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace APIReactAuth.Models
{
    public partial class Movement
    {
        public Movement()
        {
            Movementdetails = new HashSet<Movementdetail>();
        }

        public int MovementId { get; set; }
        public DateTime Date { get; set; }
        /// <summary>
        /// Solo aplica para los movimientos de entrada por compra
        /// </summary>
        public int? SupplierId { get; set; }
        /// <summary>
        /// Almacén al que refiere el movimiento 
        /// </summary>
        public int OriginWarehouseId { get; set; }
        /// <summary>
        /// Representa el almacen de de destino en el caso de ser un movimiento por traspaso
        /// </summary>
        public int? TargetWarehouseId { get; set; }
        public string Type { get; set; } = null!;
        /// <summary>
        /// Es obligatorio en caso de los movimientos por ajuste, es posible que para algún otro movimiento se use este campo para capturar algún comentario u observación importante
        /// </summary>
        public string? Notes { get; set; }
        public int CompanyId { get; set; }
        public int EmployeeId { get; set; }

        [JsonIgnore]
        public virtual Company? Company { get; set; } = null!;
        [JsonIgnore]
        public virtual Employee? Employee { get; set; } = null!;
        [JsonIgnore]
        public virtual Warehouse? OriginWarehouse { get; set; } = null!;
        [JsonIgnore]
        public virtual Supplier? Supplier { get; set; }
        [JsonIgnore]
        public virtual Warehouse? TargetWarehouse { get; set; }
        [JsonIgnore]
        public virtual ICollection<Movementdetail>? Movementdetails { get; set; }
    }
}