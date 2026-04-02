-- ============================================================
-- Quick Commerce Inventory Management System
-- Database Schema — All 8 Tables
-- ============================================================


-- 1. PRODUCT
CREATE TABLE Product (
    product_id   INT          PRIMARY KEY AUTO_INCREMENT,
    name         VARCHAR(100) NOT NULL,
    category     VARCHAR(50)  NOT NULL,
    unit_price   DECIMAL(10,2) NOT NULL CHECK (unit_price > 0),
    weight       DECIMAL(10,2) CHECK (weight > 0),
    description  TEXT
);


-- 2. WAREHOUSE
CREATE TABLE Warehouse (
    warehouse_id INT          PRIMARY KEY AUTO_INCREMENT,
    name         VARCHAR(100) NOT NULL,
    city         VARCHAR(50)  NOT NULL,
    pincode      VARCHAR(10)  NOT NULL,
    capacity     INT          CHECK (capacity > 0)
);


-- 3. INVENTORY
CREATE TABLE Inventory (
    inventory_id        INT      PRIMARY KEY AUTO_INCREMENT,
    warehouse_id        INT      NOT NULL,
    product_id          INT      NOT NULL,
    quantity_available  INT      NOT NULL CHECK (quantity_available >= 0),
    reorder_level       INT      NOT NULL CHECK (reorder_level > 0),
    is_available        BOOLEAN  NOT NULL DEFAULT TRUE,
    last_updated        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                                  ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (warehouse_id) REFERENCES Warehouse(warehouse_id),
    FOREIGN KEY (product_id)   REFERENCES Product(product_id),
    UNIQUE (warehouse_id, product_id)
);


-- 4. CUSTOMER
CREATE TABLE Customer (
    customer_id INT          PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    phone       VARCHAR(15)  NOT NULL UNIQUE,
    email       VARCHAR(100) UNIQUE,
    address     TEXT,
    pincode     VARCHAR(10)  NOT NULL
);


-- 5. ORDER
CREATE TABLE `Order` (
    order_id      INT           PRIMARY KEY AUTO_INCREMENT,
    customer_id   INT           NOT NULL,
    warehouse_id  INT           NOT NULL,
    order_status  VARCHAR(20)   NOT NULL DEFAULT 'placed'
                                CHECK (order_status IN ('placed','packed','dispatched','delivered')),
    order_time    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount  DECIMAL(10,2) NOT NULL CHECK (total_amount > 0),

    FOREIGN KEY (customer_id)  REFERENCES Customer(customer_id),
    FOREIGN KEY (warehouse_id) REFERENCES Warehouse(warehouse_id)
);


-- 6. ORDERITEM
CREATE TABLE OrderItem (
    order_item_id       INT           PRIMARY KEY AUTO_INCREMENT,
    order_id            INT           NOT NULL,
    product_id          INT           NOT NULL,
    quantity            INT           NOT NULL CHECK (quantity > 0),
    price_at_order_time DECIMAL(10,2) NOT NULL CHECK (price_at_order_time > 0),

    FOREIGN KEY (order_id)   REFERENCES `Order`(order_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id),
    UNIQUE (order_id, product_id)
);


-- 7. SUPPLIER
CREATE TABLE Supplier (
    supplier_id INT          PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    contact     VARCHAR(15)  NOT NULL UNIQUE,
    email       VARCHAR(100) NOT NULL UNIQUE
);


-- 8. RESTOCKREQUEST
CREATE TABLE RestockRequest (
    restock_id         INT           PRIMARY KEY AUTO_INCREMENT,
    warehouse_id       INT           NOT NULL,
    product_id         INT           NOT NULL,
    supplier_id        INT           NOT NULL,
    quantity_requested INT           NOT NULL CHECK (quantity_requested > 0),
    status             VARCHAR(20)   NOT NULL DEFAULT 'pending'
                                     CHECK (status IN ('pending','approved','received')),
    requested_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    received_at        TIMESTAMP     NULL,

    FOREIGN KEY (warehouse_id) REFERENCES Warehouse(warehouse_id),
    FOREIGN KEY (product_id)   REFERENCES Product(product_id),
    FOREIGN KEY (supplier_id)  REFERENCES Supplier(supplier_id)
);

ALTER TABLE Product DROP COLUMN description;
ALTER TABLE Customer DROP COLUMN address;
