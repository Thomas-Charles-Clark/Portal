/* Reset Portal Baskets
    
    WARNING! This will delete everything!

	(Use carefully and in stages, otherwise Bad Things™

 */

-- =================================================================================================
-- 1. Attempt mass basket deletion
-- =================================================================================================
 DECLARE @BasketID BIGINT

 
 --First
 SELECT  @BasketID = MIN(BasketID)
 FROM     portal.Basket
 WHERE     Deleted = 0

 WHILE @BasketID IS NOT NULL
 BEGIN
     --Flag basket, basket items, all associated allocations as deleted, and release associated allocations in Mertex
    EXEC portal.Basket_Delete @BasketID = @BasketID, -- bigint
                              @MemberID = 0  -- int
    
     --Next
     SELECT  @BasketID = MIN(BasketID)
     FROM     portal.Basket
     WHERE     Deleted = 0 AND 
             BasketID > @BasketID
 END

-- =================================================================================================
-- 2. Attempt mass RingFence deletion 
-- =================================================================================================
DECLARE @RingFencePreAllocationID BIGINT

--First
SELECT    @RingFencePreAllocationID = MIN(RingFencePreAllocationID)
FROM    portal.RingFencePreAllocation
WHERE    Deleted = 0 

 

WHILE @RingFencePreAllocationID IS NOT NULL
BEGIN
    --Delete
    EXEC portal.RingFencePreAllocation_Delete @RingFencePreAllocationID = @RingFencePreAllocationID , -- bigint
                                              @MemberID = 0 -- int
    --Next
    SELECT    @RingFencePreAllocationID = MIN(RingFencePreAllocationID)
    FROM    portal.RingFencePreAllocation
    WHERE    Deleted = 0  AND 
            RingFencePreAllocationID > @RingFencePreAllocationID
END

-- =================================================================================================
-- 3. Actually delete rows flagged as deleted
-- =================================================================================================
DELETE L FROM log.PreAllocation AS L LEFT OUTER JOIN portal.BasketPreAllocation AS B ON B.BasketPreAllocationID = L.BasketPreAllocationID AND B.Deleted = 1 LEFT OUTER JOIN  portal.RingFencePreAllocation AS R ON R.RingFencePreAllocationID = L.RingFencePreAllocationID AND R.Deleted = 1 WHERE B.BasketPreAllocationID IS NOT NULL OR R.RingFencePreAllocationID IS NOT NULL
DELETE L FROM log.PreAllocationError AS L LEFT OUTER JOIN portal.BasketPreAllocation AS B ON B.BasketPreAllocationID = L.BasketPreAllocationID AND B.Deleted = 1 LEFT OUTER JOIN  portal.RingFencePreAllocation AS R ON R.RingFencePreAllocationID = L.RingFencePreAllocationID AND R.Deleted = 1 WHERE B.BasketPreAllocationID IS NOT NULL OR R.RingFencePreAllocationID IS NOT NULL

DELETE FROM portal.BasketItem WHERE Deleted = 1
DELETE FROM portal.Basket WHERE Deleted = 1
DELETE FROM portal.BasketPreAllocation WHERE Deleted = 1
DELETE FROM portal.RingFencePreAllocation WHERE Deleted = 1

-- =================================================================================================
-- 4. Reseed
-- =================================================================================================
DBCC CHECKIDENT('log.PreAllocation',RESEED,1)
DBCC CHECKIDENT('log.PreAllocationError',RESEED,1)
DBCC CHECKIDENT('portal.Basket',RESEED,1)
DBCC CHECKIDENT('portal.BasketPreAllocation',RESEED,1)
DBCC CHECKIDENT('portal.BasketItem',RESEED,1)
DBCC CHECKIDENT('portal.RingFencePreAllocation',RESEED,1)

 

-- =================================================================================================
-- 6. Reinstate testing ringfences
-- =================================================================================================
--F1190/09, WH, 7m, K0099
EXEC portal.RingFencePreAlloction_Insert @TradeAccountID = 6400, 
                                         @TradeAccountGroupID = NULL,
                                         @ProductID = 28495,
                                         @StockLocationID = 107, 
                                         @Quantity = 7,
                                         @Piece = NULL, 
                                         @Batch = NULL,
                                         @ExpiryDT = '3000-01-01',
                                         @MemberID = 2
--F1190/09, WH, 11m, K0099
EXEC portal.RingFencePreAlloction_Insert @TradeAccountID = 6400, 
                                         @TradeAccountGroupID = NULL,
                                         @ProductID = 28495,
                                         @StockLocationID = 107, 
                                         @Quantity = 11,
                                         @Piece = NULL, 
                                         @Batch = NULL,
                                         @ExpiryDT = '3000-01-01',
                                         @MemberID = 2

 

-- =================================================================================================
-- 6. Check everything
-- =================================================================================================
-- SQL
SELECT * FROM portal.Basket
SELECT * FROM portal.BasketItem
SELECT * FROM portal.BasketPreAllocation
SELECT * FROM portal.RingFencePreAllocation
-- Mertex
SELECT * FROM clr.fnc_Mertex_PreAllocation_Status(NULL, NULL, '01/01/1900','12/31/9999')
--Logs
SELECT * FROM log.PreAllocation
SELECT * FROM log.PreAllocationError

SELECT * FROM portal.BasketPreAllocation

--EXEC clr.fnc_Mertex_PreAllocation_Delete @PreAllocationID = N'0DC6E866-E7F0-4751-AE18-7855989BF277'
--EXEC clr.fnc_Mertex_PreAllocation_Delete @PreAllocationID = N'27C637FA-80CA-4A06-B945-EEBB04E4C716'
--EXEC clr.fnc_Mertex_PreAllocation_Delete @PreAllocationID = N'44F6FB89-DE77-466B-8E58-9BADE3B8DE60'
--EXEC clr.fnc_Mertex_PreAllocation_Delete @PreAllocationID = N'56FAA747-2C77-4382-94F9-4D27BBE03419'
--EXEC clr.fnc_Mertex_PreAllocation_Delete @PreAllocationID = N'5EEE6DA2-FCBA-43BD-AEF2-75136C2D22F4'
--EXEC clr.fnc_Mertex_PreAllocation_Delete @PreAllocationID = N'6981B1E0-9C3E-42F6-8D95-9C6A1205285B'
--EXEC clr.fnc_Mertex_PreAllocation_Delete @PreAllocationID = N'C6EB05FC-27F1-478F-8A5C-08F4F4147913'
--EXEC clr.fnc_Mertex_PreAllocation_Delete @PreAllocationID = N'DA0A5275-CAB5-4FCD-8620-928FD5AD2BC5'
--EXEC clr.fnc_Mertex_PreAllocation_Delete @PreAllocationID = N'F55972B6-D28D-4F11-8735-500298C2BDBF'

EXEC portal.BasketItem_StockLocation_Update @BasketItemID = 7, @StockLocationID = 107, @MemberID = 8

EXEC portal.BasketPreAllocation_DeleteAll @BasketItemID = 8, -- bigint
                                          @MemberID = 8      -- int