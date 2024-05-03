using Newtonsoft.Json;
using Portal.Areas.Orders.Controllers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Services.Protocols;
using System.Xml.Linq;
using System.Xml.XPath;
using U2.Data.Client;
using LabelNS = Portal.LabelRecovery;
using ShipNS = Portal.Ship;
using VoidNS = Portal.Void;
using SharedEFClasses.Models.MertexLive;
using SharedEFClasses.ReturnModels;
using Portal.Utilities;
using Portal.UPSShipping;

namespace Portal.UPS
{

    /*

        UPS CIE Shipping Numbers for Testing
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


        The following table lists those special numbers and describes the results that developers should expect when attempting a request. For each test case, the first number listed is a shipment identification number; additional numbers, if present, are tracking numbers.

        ShipmentIdentificationNumber: 1ZISDE016691676846        A successful response will be returned for a shipment level cancel request.
        ShipmentIdentificationNumber: 1Z2220060290602143        A successful response will be returned for a shipment level cancel request.

        ShipmentIdentificationNumber: 1Z2220060294314162        A successful response will be returned for a package level cancel request. The request will cancel the package in the shipment.
        TrackingNumber: 1Z2220060291994175

        ShipmentIdentificationNumber: 1Z2220060292690189        A successful response will be returned for a package level cancel request. The request will cancel the package in the shipment.
        TrackingNumber: 1Z2220060292002190

        ShipmentIdentificationNumber: 1ZISDE016691609089        A successful response will be returned for a package level cancel request. The request will cancel all the packages.
        TrackingNumbers: 1ZISDE016694068891 
                         1ZISDE016690889305

        ShipmentIdentificationNumber: 1Z2220060290530202        A successful response will be returned with a partial cancel for a package level void request.
        TrackingNumbers: 1Z2220060293874210                     The request will cancel package 1Z2220060293874210
                         1Z2220060292634221                     but package 1Z2220060292634221 cannot be canceled.



        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


        To ensure that your application has the ability to process PDF and html responses correctly test your Label Recovery application using a set similar to 1Zs listed below:

        TrackingNumber: 1Z12345E8791315509                      Request is processed, label returned in PDF format

        TrackingNumber: 1Z12345E8791315413                      Request is processed, label returned in html format


        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


        UPS Premier Silver Shipment - Label returned in ZPL format
        TrackingNumber: 1ZTESTAN0154809878                      Request is processed, label returned in ZPL format

        UPS Premier Gold Return Shipment - Label returned in GIF(html) and pdf format
        TrackingNumber: 1ZTESTAN8480418532                      Request is processed, label returned in html and Pdf format

        UPS Premier Platinum Shipment - Label returned in GIF(html) and pdf format
        TrackingNumber: 1ZTESTAN0150617707                      Request is processed, label returned in html and Pdf format


        
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        
        List (A) Return Service Codes
            2 = UPS Print and Mail (PNM) 
            3 = UPS Return Service 1-Attempt (RS1) 
            5 = UPS Return Service 3-Attempt (RS3) 
            8 = UPS Electronic Return Label (ERL) 
            9 = UPS Print Return Label (PRL) 
            10 = UPS Exchange Print Return Label 
            11 = UPS Pack & Collect Service 1-Attempt Box 1 
            12 = UPS Pack & Collect Service 1-Attempt Box 2 
            13 = UPS Pack & Collect Service 1-Attempt Box 3 
            14 = UPS Pack & Collect Service 1-Attempt Box 4 
            15 = UPS Pack & Collect Service 1-Attempt Box 5 
            16 = UPS Pack & Collect Service 3-Attempt Box 1 
            17 = UPS Pack & Collect Service 3-Attempt Box 2 
            18 = UPS Pack & Collect Service 3-Attempt Box 3 
            19 = UPS Pack & Collect Service 3-Attempt Box 4 
            20 = UPS Pack & Collect

        List (Aii): Service codes
            01 = Next Day Air 
            02 = 2nd Day Air 
            03 = Ground 
            07 = Express
            08 = Expedited
            11 = UPS Standard
            12 = 3 Day Select
            13 = Next Day Air Saver
            14 = UPS Next Day Air® Early
            17 = UPS Worldwide Economy DDU
            54 = Express Plus
            59 = 2nd Day Air A.M.
            65 = UPS Saver
            M2 = First Class Mail
            M3 = Priority Mail
            M4 = Expedited MaiI Innovations
            M5 = Priority Mail Innovations
            M6 = Economy Mail Innovations
            M7 = MaiI Innovations (MI) Returns
            70 = UPS Access Point™ Economy
            71 = UPS Worldwide Express Freight Midday
            72 = UPS Worldwide Economy DDP
            74 = UPS Express®12:00
            82 = UPS Today Standard 
            83 = UPS Today Dedicated Courier 
            84 = UPS Today Intercity 
            85 = UPS Today Express 
            86 = UPS Today Express Saver 
            96 = UPS Worldwide Express

        List (B) InternationalForms/FormType
            01 - Invoice 
            03 - CO 
            04 - NAFTA CO 
            05 - Partial Invoice 
            06 - Packinglist
            07 - Customer Generated Forms
            08 – Air Freight Packing List
            09 - CN22 Form 
            10 – UPS Premium Care Form
            11 - EEI 
            For shipment with return service, 01, 05 or 10 are the only valid values. 
            Note: 01 and 05 are mutually exclusive and 05 are only valid for return shipments only.


        List (C) Product Unit of Measurement Codes
            BA = Barrel 
            BE = Bundle 
            BG = Bag 
            BH = Bunch 
            BOX = Box 
            BT = Bolt 
            BU = Butt 
            CI = Canister 
            CM = Centimeter 
            CON = Container 
            CR = Crate 
            CS = Case 
            CT = Carton 
            CY = Cylinder 
            DOZ = Dozen 
            EA = Each 
            EN = Envelope 
            FT = Feet 
            KG = Kilogram 
            KGS = Kilograms 
            LB = Pound 
            LBS = Pounds 
            L = Liter 
            M = Meter 
            NMB = Number 
            PA = Packet 
            PAL = Pallet 
            PC = Piece 
            PCS = Pieces 
            PF = Proof Liters 
            PKG = Package 
            PR = Pair 
            PRS = Pairs 
            RL = Roll 
            SET = Set 
            SME = Square Meters 
            SYD = Square Yards 
            TU = Tube 
            YD = Yard 
            OTH = Other

        List (D) Terms of Shipment
            CFR: Cost and Freight 
            CIF: Cost Insurance and Freight 
            CIP: Carriage and Insurance Paid 
            CPT: Carriage Paid To 
            DAF: Delivered at Frontier 
            DDP: Delivery Duty Paid 
            DDU: Delivery Duty Unpaid 
            DEQ: Delivered Ex Quay 
            DES: Delivered Ex Ship 
            EXW: Ex Works 
            FAS: Free Alongside Ship
            FCA: Free Carrier 
            FOB: Free On Board


        NOTE B

            We always set 5.0kg - Sarah asks *** to confirm with Ashley - Road services, we do not weigh outbound. We cannot even hope to have customers provide dimensions or weights on returns.
            Leave the dimensions and weight out! Hurrah.



        NOTE C

            Scheduling a collection date?

        NOTE D

            Reference 1 is the Order number?
            Reference 2 is the Pick List number?
            Reference 3 
            Reference 4
            Reference 5
    */

    public static partial class UPSFunctions
    {
//        public static Address BuildReturnAddressFromCCRNumber(string ccrNumber)
//        {
//            var result = new Address();

//            using (var mertexSql = new MertexSQLConnection("MERTEX", 10))
//            {
//                var conn = mertexSql.Connection;

//                var selectComm = conn.CreateCommand();

//                //selectComm.CommandText = $@"SELECT   TH.[COLNAME],
//                //                                     TH.[COLADDR1],
//                //                                     TH.[COLADDR2],
//                //                                     TH.[COLADDR3],
//                //                                     TH.[COLADDR4],
//                //                                     TH.[COLPCODE],
//                //                                     TH.[TO.COUNTRY],
//                //                                     C.COUNTRY,
//                //                                     TH.[CONTACT.EMAIL.DES],
//                //                                     C.[EMAIL],
//                //                                     TH.[CONTACT.PHONE.DES],
//                //                                     C.[CONPHONE],
//                //                                     TH.CUSREF
//                //                            FROM     TCCHEAD AS TH
//                //                            INNER JOIN SLCUST AS C ON C.[@ID] = TH.CUSREF
//                //                            INNER JOIN TOEHEAD AS TOH ON TOH.[@ID] = TH.[SORDERNO] 
//                //                            WHERE    TH.[@ID] = @CCRNumber
//                //                            NOWAIT";

//                selectComm.CommandText = $@"SELECT   TOH.[DELNAME],
//                                                     TOH.[DELADDR1],
//                                                     TOH.[DELADDR2],
//                                                     TOH.[DELADDR3],
//                                                     TOH.[DELADDR4],
//                                                     TOH.[DELPCODE],
//                                                     TOH.[TO.COUNTRY],
//                                                     C.COUNTRY,
//                                                     TOH.[SS.EMAIL],
//                                                     C.[EMAIL],
//                                                     TH.[CONTACT.PHONE.DES],
//                                                     C.[CONPHONE],
//                                                     TH.CUSREF
//                                            FROM     TCCHEAD AS TH
//                                            INNER JOIN SLCUST AS C ON C.[@ID] = TH.CUSREF
//                                            INNER JOIN TOEHEAD AS TOH ON TOH.[@ID] = TH.[SORDERNO] 
//                                            WHERE    TH.[@ID] = @CCRNumber
//                                            NOWAIT";

//                var selectParams = new List<U2Parameter>()
//                {
//                    new U2Parameter("@CCRNumber", ccrNumber)
//                };

//                selectComm.Parameters.AddRange(selectParams.ToArray());

//                conn.Open();

//                var reader = selectComm.ExecuteReader();

//                while (reader.Read())
//                {
//#if DEBUG
//                    Console.WriteLine("Address: ");
//                    for (var i = 0; i < reader.FieldCount; i++)
//                    {
//                        Console.WriteLine(reader.IsDBNull(i) ? "" : reader.GetString(i));
//                    }
//#endif

//                    result.Name = reader.IsDBNull(0) ? null : reader.GetString(0);
//                    result.AddressLine1 = reader.IsDBNull(1) ? null : reader.GetString(1);
//                    result.AddressLine2 = reader.IsDBNull(2) ? null : reader.GetString(2);
//                    result.Town = reader.IsDBNull(3) ? null : reader.GetString(3);
//                    result.County = reader.IsDBNull(4) ? null : reader.GetString(4);
//                    result.Postcode = reader.IsDBNull(5) ? null : reader.GetString(5);
//                    result.CountryCodeISOAlpha2 = reader.IsDBNull(6) ? reader.IsDBNull(7) ? null : reader.GetString(7) : reader.GetString(6);
//                    result.Email = reader.IsDBNull(8) ? reader.IsDBNull(9) ? null : reader.GetString(9) : reader.GetString(8);
//                    result.Phone = reader.IsDBNull(10) ? reader.IsDBNull(11) ? null : reader.GetString(11) : reader.GetString(10);
//                }

//                reader.Close();
//            }

//            if (!String.IsNullOrEmpty(result.CountryCodeISOAlpha2))
//            {
//                using (var conn = new SqlConnection("Data Source=vm-sql.designersguild.com;Initial Catalog=Flock;Integrated Security=False;Persist Security Info=True;User ID=dg;Password=mattm00;MultipleActiveResultSets=true"))
//                {
//                    var comm = conn.CreateCommand();

//                    comm.CommandText = "SELECT CountryID FROM dbo.Country WHERE Code = @CountryCode";

//                    comm.Parameters.AddWithValue("@CountryCode", result.CountryCodeISOAlpha2);

//                    conn.Open();

//                    var reader = comm.ExecuteReader();

//                    while (reader.Read())
//                    {
//                        result.CountryID = reader.IsDBNull(0) ? (short?)null : reader.GetInt16(0);
//                    }

//                    reader.Close();

//                    conn.Close();
//                }
//            }

//            return result;
//        }

        public static VoidReply VoidLabel(string trackingNumber)
        {
            var result = new VoidReply();

            var voider = new VoidNS.VoidService();

            var request = new VoidNS.VoidShipmentRequest()
            {
                Request = new VoidNS.RequestType()
                {
                    RequestOption = null, // unused
                    SubVersion = "1807",
                    TransactionReference = new VoidNS.TransactionReferenceType()
                    {
                        CustomerContext = null, // unnecessary
                        TransactionIdentifier = null // empty tag, unused, left for future uses
                    }
                },
                VoidShipment = new VoidNS.VoidShipmentRequestVoidShipment()
                {
                    ShipmentIdentificationNumber = trackingNumber
                    //TrackingNumber = new string[] { trackingNumber }
                }
            };

            var sec = new VoidNS.UPSSecurity();

            var accessToken = new VoidNS.UPSSecurityServiceAccessToken
            {
                AccessLicenseNumber = "4D61FFBADC79A42A"
            };

            sec.ServiceAccessToken = accessToken;

            var userToken = new VoidNS.UPSSecurityUsernameToken
            {
                Username = Credentials.userId,
                Password = Credentials.password
            };

            sec.UsernameToken = userToken;

            voider.UPSSecurityValue = sec;

            try
            {
                result.Response = voider.ProcessVoid(request);
            }
            catch (SoapException se)
            {
                result.ErrorDetails = JsonConvert.SerializeObject(se.Detail, Formatting.Indented);
                result.Response = null;
            }

            return result;
        }

        public static RecoverLabelReply RecoverLabel(string trackingNumber)
        {
            #region preparation 

            Console.WriteLine($"Recovering Label: {trackingNumber}");

            System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12 | System.Net.SecurityProtocolType.Tls | System.Net.SecurityProtocolType.Tls11;

            var result = new RecoverLabelReply();

            var recovery = new LabelNS.LBRecovery();

            var request = new LabelNS.LabelRecoveryRequest();

            var sec = new LabelNS.UPSSecurity();

            var accessToken = new LabelNS.UPSSecurityServiceAccessToken
            {
                AccessLicenseNumber = "4D61FFBADC79A42A"
            };

            sec.ServiceAccessToken = accessToken;

            var userToken = new LabelNS.UPSSecurityUsernameToken
            {
                Username = Credentials.userId,
                Password = Credentials.password
            };

            sec.UsernameToken = userToken;

            recovery.UPSSecurityValue = sec;

            var requestType = new LabelNS.RequestType()
            {
                TransactionReference = new LabelNS.TransactionReferenceType()
                {
                    CustomerContext = null,
                    TransactionIdentifier = null
                },
                SubVersion = "1807",
                RequestOption = null
            };

            request.Request = requestType;

            #endregion

            request.LabelSpecification = new LabelNS.LabelSpecificationType()
            {
                LabelImageFormat = new LabelNS.LabelImageFormatType()
                {
                    Code = "PDF"
                }
            };

            request.LabelDelivery = new LabelNS.LabelDeliveryType()
            {
                //LabelLinkIndicator = ""
            };

            //request.Translate = new LabelNS.TranslateType()
            //{
            //    LanguageCode = "deu",
            //    DialectCode = "DE",
            //    Code = "01"
            //};

            request.ReferenceValues = new LabelNS.ReferenceValuesType()
            {
                ShipperNumber = "5WR515",
                ReferenceNumber = new LabelNS.ReferenceNumberType()
                {
                    Value = trackingNumber
                }
            };

            request.TrackingNumber = trackingNumber;

            //request.

            try
            {
                var label_recovery_response = recovery.ProcessLabelRecovery(request);
                result.Response = label_recovery_response;
                result.Results = label_recovery_response.Items.OfType<LabelNS.LabelResultsType>().ToList();
            }
            catch (SoapException se)
            {
                result.ErrorDetails = JsonConvert.SerializeObject(se.Detail, Formatting.Indented);
                result.Response = null;
            }

            return result;
        }

        public static ShipConfirmReply SendShipConfirmRequest(
            string uniqueId,
            string upsAccountNumber,
            string declarationStatement,
            PassReturn objReturn,
            string memo = null,
            string notificationEmail = null,
            string deliveryTerms = "DDP")
        {
            var accountAddress = GetDesignersGuildAddress(upsAccountNumber);

            var toAddress = DesignersGuildAddressType(accountAddress);

            bool internationalFormsRequired = objReturn.CollectionCountryID != accountAddress.CountryID;

            var result = new ShipConfirmReply();

            var service = new ShipNS.ShipService();

            var sec = new ShipNS.UPSSecurity();

            var accessToken = new ShipNS.UPSSecurityServiceAccessToken
            {
                AccessLicenseNumber = "4D61FFBADC79A42A"
            };

            sec.ServiceAccessToken = accessToken;

            var userToken = new ShipNS.UPSSecurityUsernameToken
            {
                Username = Credentials.userId,
                Password = Credentials.password
            };

            sec.UsernameToken = userToken;

            service.UPSSecurityValue = sec;

            var request = new ShipNS.ShipConfirmRequest()
            {
                LabelSpecification = new ShipNS.LabelSpecificationType()
                {
                    LabelImageFormat = new ShipNS.LabelImageFormatType()
                    {
                        Code = "PNG"
                    }
                },
                Request = new ShipNS.RequestType()
                {
                    SubVersion = "1807",
                    RequestOption = new string[] { "nonvalidate" }
                },
                Shipment = new ShipNS.ShipmentType()
                {
                    AlternateDeliveryAddress = null,    // We're not delivering, we're returning

                    ShipmentIndicationType = null,      // Used to indicate some option regarding delivery to UPS Access Points

                    CostCenter = null,                  // CostCenter applies to Mail Innovations Returns shipments

                    CostCenterBarcodeIndicator = null,  // Used to indicate that we desire the CostCenter value to be barcoded at the bottom of the label

                    Description = "RETURN OF GOODS", // *** We've got to describe the package in 50 characters or less...?

                    DGSignatoryInfo = null, // We don't need Dangerous Goods signatory info... unless we do for paint?

                    DocumentsOnlyIndicator = null, // We're not returning just documents...

                    FreightShipmentInformation = null, // We're not dealing with Freight

                    FRSPaymentInformation = null, // We're not dealing with Freight, so we're definitely not dealing with Freight Shipment Payment Information...

                    GoodsNotInFreeCirculationIndicator = null, // Our goods are in free circulation, in that we're not prohibited from selling them to / using them in the EU.

                    InvoiceLineTotal = null, // Required for forward shipments whose origin is the US and destination is Puerto Rico or Canada. Not available for any other shipments. 
                                             // FOR OTHER DESTINATIONS the InvoiceLineTotal in the International Forms Container must be used.

                    IrregularIndicator = null, // Nothing irregular going on here, officer... (1 = Balloon / 2 = Oversize / 3 = Not Applicable)

                    Locale = null, //  Valid only for Alternate Delivery Location notification and UAP Shipper notification.

                    MasterCartonID = null, // If Economy Service (17 or 72): Economy Shipment will be associated with given Master Carton ID.
                                           // If Non-Economy Service: Master Carton Shipment will be created for given Master Carton ID.

                    MasterCartonIndicator = null, // MasterCartonIndicator is only valid with Econmoy Shipment (Service Code 17 or 72). Will be ignored if master carton id present.

                    MIDualReturnShipmentIndicator = null, // Mail Innovations: not something we're concerned with

                    MIDualReturnShipmentKey = null, // Mail Innovations: not something we're concerned with

                    MILabelCN22Indicator = null, // Mail Innovations: not something we're concerned with

                    MovementReferenceNumber = null, // Not required, no idea what a Movement Reference Numer is, only that it must be 18 characters and the 3rd and 4th characters must be Shipper Country ISO Code

                    NumOfPiecesInShipment = null, // Only applies to UPS Wordlwide Express Freight shipments. Indicates the total number of pieces on a pallet.

                    Package = GeneratePackages(objReturn.ReturnParcels.ToList()),
                    PackageID = uniqueId, // this is a unique GUID referring to the shipment on our side
                    PackageIDBarcodeIndicator = null, // Do we want to have Reference 1 barcoded?
                    PaymentInformation = new ShipNS.PaymentInfoType()
                    {
                        ShipmentCharge = new ShipNS.ShipmentChargeType[]
                        {
                            new ShipNS.ShipmentChargeType() // *** Bill us for the Transportation
                            {
                                BillShipper = new ShipNS.BillShipperType()
                                {
                                    AccountNumber = upsAccountNumber
                                },
                                Type = "01" // Required: Values are ,  
                                            // 01 = Transportation
                                            // 02 = Duties and Taxes
                                            // 03 = Broker of Choice
                            },
                            new ShipNS.ShipmentChargeType() // *** and for the Duty and Taxes ? 
                            {
                                BillShipper = new ShipNS.BillShipperType()
                                {
                                    AccountNumber = upsAccountNumber
                                },
                                Type = "02" // Required: Values are ,  
                                            // 01 = Transportation
                                            // 02 = Duties and Taxes
                                            // 03 = Broker of Choice
                            }
                        }
                    }, // required for non-ground freight shipments only
                    PromotionalDiscountInformation = null, // We won't be grubbing about for any UPS promotion codes...
                    RatingMethodRequestedIndicator = "", // Providing any non-null value here will apparently return Billable Weight Calculation and Rating Method information in the response. Yay! ***
                    ReferenceNumber = new ShipNS.ReferenceNumberType[] // References at the Shipment Level
                    {
                        new ShipNS.ReferenceNumberType()
                        {
                            BarCodeIndicator = null, // Do not barcode
                            Code = "RZ", // Return Authorization Number ***
                            Value = objReturn.ClaimID
                        },
                        new ShipNS.ReferenceNumberType()
                        {
                            BarCodeIndicator = null, // Do not barcode
                            Code = "SA", // Department 
                            Value = "CS" // ***
                        },
                    },
                    ReturnService = new ShipNS.ReturnServiceType()
                    {
                        Code = "8" // *** Important configurable! See List (A)
                    },
                    Service = new ShipNS.ServiceType()
                    {
                        Code = "11" // *** See List (Aii)
                    },
                    ShipFrom = new ShipNS.ShipFromType()
                    {
                        Address = new ShipNS.ShipAddressType()
                        {
                            AddressLine = new string[]
                            {
                                objReturn.CollectionAddressLine1?.TrimReduceTruncate(35),   // 35 characters are accepted, but for return Shipment only 30 characters will be printed on the label.
                                objReturn.CollectionAddressLine2?.TrimReduceTruncate(35),   // ""
                            },
                            City = objReturn.CollectionTown?.TrimReduceTruncate(35), // 35 characters are accepted, but for return Shipment only 15 characters will be printed on the label.
                            CountryCode = objReturn.CollectionCountry.Code,
                            PostalCode = objReturn.CollectionPostcode?.TrimReduceTruncate(9),
                            StateProvinceCode = objReturn.CollectionStateProvinceCode?.TrimReduceTruncate(5)
                        },
                        Name = objReturn.CollectionCompanyName?.TrimReduceTruncate(35) ?? objReturn.CollectionContactName?.TrimReduceTruncate(35),
                        AttentionName = objReturn.CollectionContactName?.TrimReduceTruncate(35) ?? objReturn.CollectionCompanyName?.TrimReduceTruncate(35),
                        CompanyDisplayableName = null, // not applicable for ShipFrom, apparently
                        EMailAddress = objReturn.CollectionEmail, // omitted; this is not even mentioned in the documentation...
                        FaxNumber = null, // omitted; faxes are history
                        Phone = new ShipNS.ShipPhoneType()
                        {
                            Number = objReturn.CollectionPhoneNumber?.TrimReduceTruncate(15) ?? "+442078937400",
                            Extension = null // 
                        },
                        TaxIdentificationNumber = null,  // Shipper’s Tax Identification Number. Conditionally required if EEI form(International forms) 
                                                         // is requested and ship From is not mentioned.
                        TaxIDType = null //  Applies to EEI form only. Valid values: EIN, DNS, and FGN.

                    },
                    ShipmentRatingOptions = new ShipNS.RateInfoType()
                    {
                        FRSShipmentIndicator = null, // Not freight
                        NegotiatedRatesIndicator = "", // Yes we want our negotiated rates... ***
                        RateChartIndicator = "", // Don't know if we want this, but... data is good? 
                        UserLevelDiscountIndicator = null // No, we're not going user-level for anything ever.
                    },
                    ShipmentServiceOptions = new ShipNS.ShipmentTypeShipmentServiceOptions()
                    {
                        LabelDelivery = new ShipNS.LabelDeliveryType()
                        {
                            EMail = null, // We don't want to have the labels emailed to us...
                            LabelLinksIndicator = "" // We want the links, not emails.
                        },
                        InternationalForms = internationalFormsRequired ? new ShipNS.InternationalFormType() // *** WOO INTERNATIONAL FORMS!!! Oh, bugger...
                        {
                            AdditionalDocumentIndicator = null, // *** Presence of the indicator means user will supply additional document, such as EEI, NAFTA_CO or CO.
                            BlanketPeriod = null, // This applies only to NAFTA (North American Free Trade Agreement) CO 
                            CarrierID = null, // Applies to EEI forms only, no validations. The four-character Standard Carrier Alpha Code (SCAC) for vessel, rail, and truck shipments. 
                                              // For air shipment, enter the two or three character International Air Transport Association (IATA) code.
                            CN22Form = null, // *** Required if the customer wants to use the UPS generated CN22
                            Comments = $"Return of {objReturn.ReturnParcels.SelectMany(p => p.Products).Where(p => !String.IsNullOrEmpty(p.OriginalTrackingNumber)).Select(p => p.OriginalTrackingNumber).FirstOrDefault() ?? "Products"}", // 150 chars, *** Any extra information about the shipment?
                            Contacts = new ShipNS.ContactType() // *** Required for EEI and NAFTA CO. Ultimate consignee contact information.
                            {
                                ForwardAgent = null, // The forwarding agent is the company or person acting as agent in the trans-shipping of freight to the destination country or territory. There isn't one? ***
                                IntermediateConsignee = null, // The intermediate consignee is the person or company in the importing country or territory that makes final delivery to the ultimate consignee. That's UPS, isn't it? ***
                                Producer = null, // Applies to NAFTA CO
                                SoldTo = new ShipNS.SoldToType() // *** Applies to Invoice and NAFTA CO Forms. 
                                                                 // Required if Invoice or NAFTA CO (International Form) is requested.
                                {
                                    Address = DesignersGuildAddressType(accountAddress),
                                    AttentionName = "Designers Guild",
                                    EMailAddress = "itsupport@designersguild.com",
                                    Name = "Designers Guild",
                                    Option = null, // Applies to NAFTA CO only
                                    Phone = new ShipNS.PhoneType()
                                    {
                                        Number = "02078937400",
                                        Extension = null
                                    },
                                    TaxIdentificationNumber = accountAddress.TaxID
                                },
                                UltimateConsignee = null // Applies to EEI only
                            },
                            ContainerizedIndicator = null, // Applies to vessel shipments only
                            CurrencyCode = "GBP", // Currency code for all the monetary values of the Invoice form.
                            DeclarationStatement = declarationStatement.TrimReduceTruncate(550), // *** Veeery important! I hereby declare that something something.
                            Discount = null, // Applies to Invoice and Partial Invoice forms only. 
                                             // The discount to be subtracted from the sum of the total value on the invoice.
                                             // This value should be greater than or equal to zero or less than or equal to the value of all goods listed on the invoice.
                            ECCNNumber = null, // *** This is not mentioned anywhere in the documentation!
                            EEIFilingOption = null, // This... We're not filing Electronic Export Information, so this isn't required?
                            EntryNumber = null, // Applies to EEI only
                            ExportDate = null, // Applies to EEI and CO forms only
                            ExportingCarrier = null, // Applies to EEI and CO forms only
                            FormGroupIdName = null, // Not mandatory. Contains description text which identifies the group of International forms. This element does not appear on the forms.
                            FormType = new string[] { "01" }, // Indicates the name of the International Form requested. *** See List (B)
                            FreightCharges = null, // Not dealing with freight
                            HazardousMaterialsIndicator = null, // Not dealing with hazardous materials *** UNLESS PAINT COUNTS!
                            InBondCode = null, // Applies to EEI only
                            InsuranceCharges = null, // NO IN-SEWER-ANTS!
                            InvoiceDate = DateTime.Now.ToString("yyyyMMdd"), // Applies to Invoice and Partial Invoice forms only. 
                                                                             // Required for Invoice forms and optional for Partial Invoice. Required for Invoice form for forward shipments. 
                                                                             // For shipment with return service, the user input will be ignored, and the field will be blank on the invoice. Format is yyyyMMdd.
                            InvoiceNumber = $"CCR {objReturn.ClaimID}", // Omitted because we can't always guarantee a single invoice is involved in this return
                            License = null, // *** This is not mentioned in the documentation!
                            LoadingPier = null, // Applies to EEI forms only.
                            ModeOfTransport = null, // Applies to EEI forms only,
                            MultiCurrencyInvoiceLineTotal = null, // *** Not mentioned in the documentation!
                            OtherCharges = null, // Container tag that holds the information of amount that covers additional charges not already listed on the invoice. *** Do we have any to declare?
                            OverridePaperlessIndicator = null, // No thanks
                            PartiesToTransaction = null, // Applies to EEI forms only
                            PointOfOrigin = null, // Applies to EEI forms only
                            PointOfOriginType = null, // Applies to EEI forms only
                            PortOfExport = null, // Applies to EEI forms only
                            PortOfUnloading = null, // Applies to EEI forms only
                            Product = GenerateProducts(objReturn.ReturnParcels.SelectMany(p => p.Products).ToList()),
                            PurchaseOrderNumber = objReturn.ClaimID.TrimReduceTruncate(35), // The Customer's Purchase Order Number
                            ReasonForExport = "RETURN", // *** A reason to export the current international shipment. 
                                                        // Valid values: SALE, GIFT, SAMPLE, RETURN, REPAIR, INTERCOMPANYDATA, Any other reason
                            RoutedExportTransactionIndicator = null, // EEI only
                            SEDFilingOption = null, // EEI only
                            ShipperMemo = memo.TrimReduceTruncate(300), // *** Forward Shipment Only. Text for the shipper to add additional information.
                            TermsOfShipment = deliveryTerms, // *** See List (D)
                            UPSPremiumCareForm = null, // Valid only for Canada to Canada shipments
                            UserCreatedForm = null // Required if Form Type is 07.
                        } : null,
                        Notification = String.IsNullOrEmpty(notificationEmail) ? null : new ShipNS.NotificationType[]
                        {
                            new ShipNS.NotificationType()
                            {
                                NotificationCode = "5",
                                EMail = new ShipNS.EmailDetailsType()
                                {
                                    EMailAddress = new string[]
                                    {
                                        notificationEmail
                                    }
                                }
                            }
                        }
                    },
                    Shipper = DesignersGuildShipperType(upsAccountNumber, accountAddress),
                    ShipTo = DesignersGuildShipToType(accountAddress),
                    SubClassification = null, // SubClass is only required if the customer’s contract have them subclass the package not UPS.
                    TaxInformationIndicator = "", // If present, any taxes that may be applicable to a shipment would be returned in response.
                                                  // If this indicator is requested with NegotiatedRatesIndicator.
                                                  // Tax related information, if applicable, would be returned only for Negotiated Rates and not 
                                                  // for Published Rates. The Tax related information includes any type of Taxes, corresponding 
                                                  // Monetary Values, Total Charges with Taxes and disclaimers(if applicable)
                                                  // would be returned in response.
                    USPSEndorsement = null // USPS endorsement is a Special handling for UPS SurePost shipments delivered by the USPS.
                }
            };

            try
            {
                result.Response = service.ProcessShipConfirm(request);
            }
            catch (SoapException se)
            {
                result.ErrorDetails = JsonConvert.SerializeObject(se.Detail, Formatting.Indented);
                result.Response = null;
            }

            /*
             I mean... look, you're going to have to look for *** to find fields you think you might need to provide.
             */

            return result;
        }

        public static ShipNS.PackageType[] GeneratePackages(List<ReturnParcel> returning)
        {
            var results = new List<ShipNS.PackageType>();

            for (var i = 0; i < returning.Count; i++)
            {
                var rp = returning[i];

                var references = rp.Collections.SelectMany(c => c.ReturnCollection.UPSConsignments.SelectMany(p => new List<string>() { p.ShipmentReference1, p.ShipmentReference2 })).ToList();

                results.Add(new ShipNS.PackageType()
                {
                    AdditionalHandlingIndicator = null, // No need to additionally handle this return
                    Commodity = null, // Only required / desired if Grouidn Freight Pricing Shipment indicator is present.
                    Description = "RETURN PACKAGE".TrimReduceTruncate(35), // *** Required for Shipment with Return Service... but what should I set it to? ***
                    Dimensions = null, // What was our preferred way to indicate dimensionality to UPS? How on earth can we? This is end customer grabbing random box time.
                    DimWeight = null,
                    //new ShipNS.PackageWeightType()
                    //{
                    //    Weight = "5.0",  // *** WE ALWAY SET 5 KILOS BECAUSE CONTRACTUAL AGREEMENTS SEE NOTE B
                    //    UnitOfMeasurement = new ShipNS.ShipUnitOfMeasurementType()
                    //    {
                    //        Code = "KGS",
                    //        Description = "Kilograms"
                    //    }
                    //}, // Invalid, eh?
                    HazMatPackageInformation = null, // Unless we need this for Paint? Do we accept Paint returns? *** 
                    LargePackageIndicator = null, // No idea. Is it? ***
                    NumOfPieces = null, // another Freight related field
                    PackageServiceOptions = new ShipNS.PackageServiceOptionsType()
                    {
                        AccessPointCOD = null, // Not wanting cash on delivery
                        ClinicalTrialsID = null, // I hope our products aren't involved in clinical trials...
                        COD = null, // Again, not wanting cash on delivery
                        DeclaredValue = null,//new ShipNS.PackageDeclaredValueType() // ***
                        //{
                        //    CurrencyCode = "GBP", // ***
                        //    MonetaryValue = rp.Products.Select(p => p.Value).Sum()?.ToString("0.00"), // ***
                        //    Type = new ShipNS.DeclaredValueType()
                        //    {
                        //        Code = "01" // *** "EVS" for "Declared Value".
                        //    }
                        //},
                        DeliveryConfirmation = null, // "Valid for forward shipments only"
                        DryIce = null, // We are not shipping dry ice anywhere last I checked...
                        HazMat = null, // *** do we need to fill any of this guy in for Paint?

                        //Notification = new ShipNS.PSONotificationType() // I think we very much will want some of this, please... Quantum View Notifications? 
                        //{
                        //    NotificationCode = "3", // Valid values: 3 - Receiver Return Notification,  
                        //                            // 6 - QV Email Notification, 
                        //                            // 7 - QV Exception Notification,
                        //                            // 8 - QV Delivery Notification. For Mail Innovations forward shipments, 
                        //                            //            QV Email Notifications are allowed for First Class, Priority Mail, and Expedited Mail Innovation services
                        //    EMail = i == 0 ? new ShipNS.EmailDetailsType()
                        //    {
                        //        EMailAddress = new string[] { "tclark@designersguild.com" },
                        //        FromEMailAddress = "pkginfo@ups.com", // the "Reply To" email: our SPF rules will block these if I provide some @designersguild.com email here
                        //        FromName = "UPS Shipping Info", // From Name
                        //        Memo = "Memo", // Memo
                        //        Subject = null, // We want the default: The eMails subject. Defaults to the UPS Receiver Return Notification plus the shipment ID.
                        //        SubjectCode = null, // Not required, let it default
                        //        UndeliverableEMailAddress = "itsupport@designersguild.com"
                        //    } : new ShipNS.EmailDetailsType()
                        //    {
                        //        EMailAddress = new string[] { "tclark@designersguild.com" },
                        //        FromEMailAddress = null, // the "Reply To" email: our SPF rules will block these if I provide some @designersguild.com email here
                        //        FromName = null, // From Name
                        //        Memo = null, // Memo
                        //        Subject = null, // We want the default: The eMails subject. Defaults to the UPS Receiver Return Notification plus the shipment ID.
                        //        SubjectCode = null, // Not required, let it default
                        //        UndeliverableEMailAddress = null
                        //    }
                        //},

                        PackageIdentifier = null, // Required for Hazmat shipment if SubVersion is greater than or equal to 1701.
                        ProactiveIndicator = null, // Contractual accessorial for health care companies to allow package monitoring throughout the UPS system.
                        RefrigerationIndicator = null, // Shippers account needs to have a valid contract for Refrigeration.
                        ShipperReleaseIndicator = null, // Only available for US50/PR to US50/PR packages without return service.
                        UPSPremiumCareIndicator = null // *** An UPSPremiumCareIndicator indicates special handling is required for shipment having controlled substances.
                                                       // This is an option for Returns - UPS Standard - will we ever need it?
                    },
                    PackageWeight = new ShipNS.PackageWeightType()
                    {
                        UnitOfMeasurement = new ShipNS.ShipUnitOfMeasurementType()
                        {
                            Code = "KGS"
                        },
                        Weight = "5.0" // *** WE ALWAY SET 5 KILOS BECAUSE CONTRACTUAL AGREEMENTS SEE NOTE B
                    },
                    Packaging = new ShipNS.PackagingType()
                    {
                        Code = "02",
                        Description = "Customer Supplied Package"
                    },
                    PalletDescription = null, // Not providing a pallet...
                    ReferenceNumber = GeneratePackageReferences(references),
                    UnitPrice = null, // Applicable to Air Freight only }
                    UPSPremier = null // We're not requesting anything to do with UPS Premier service levels.
                });
            }

            //returning.ReturnParcels.ForEach(rp => 
            //{

            //});

            return results.ToArray();
        }

        public static ShipNS.ReferenceNumberType[] GeneratePackageReferences(List<string> references)
        {
            if (references == null)
                return null;
            if (references.Count == 0)
                return null;

            var results = new List<ShipNS.ReferenceNumberType>();

            references.ForEach(c =>
            {
                results.Add(new ShipNS.ReferenceNumberType()
                {
                    BarCodeIndicator = null, // Do not barcode our return number? This might be good, actually? ***
                    Code = "TN", // Transaction Reference Number ***
                    Value = c //***
                });
            });

            return results.ToArray();
        }

        public static ShipAcceptReply SendShipAcceptRequest(string shipDigest)
        {
            var result = new ShipAcceptReply();

            var service = new ShipNS.ShipService();

            var sec = new ShipNS.UPSSecurity();

            var accessToken = new ShipNS.UPSSecurityServiceAccessToken
            {
                AccessLicenseNumber = "4D61FFBADC79A42A"
            };

            sec.ServiceAccessToken = accessToken;

            var userToken = new ShipNS.UPSSecurityUsernameToken
            {
                Username = Credentials.userId,
                Password = Credentials.password
            };

            sec.UsernameToken = userToken;

            service.UPSSecurityValue = sec;

            var shipAccept = new ShipNS.ShipAcceptRequest()
            {
                ShipmentDigest = shipDigest
            };

            try
            {
                result.Response = service.ProcessShipAccept(shipAccept);
            }
            catch (SoapException se)
            {
                result.ErrorDetail = JsonConvert.SerializeObject(se.Detail, Formatting.Indented);
                result.Response = null;
            }

            return result;
        }

        public static Address GetDesignersGuildAddress(string upsAccountNumber)
        {
            var result = new Address();

            using (var conn = new SqlConnection("Data Source=vm-sql.designersguild.com;Initial Catalog=Flock;Integrated Security=False;Persist Security Info=True;User ID=dg;Password=mattm00;MultipleActiveResultSets=true"))
            {
                var comm = conn.CreateCommand();
                comm.CommandType = CommandType.Text;
                comm.CommandText = @"SELECT
                    A.CompanyName,
                    A.AddressLine1,
                    A.AddressLine2,
                    A.Town,
                    A.StateProvinceCode,
                    A.Postcode,
                    A.CountryCode,
                    A.LocationName,
                    A.TaxID,
                    C.CountryID
                FROM ups.Account AS A
                    INNER JOIN dbo.Country AS C ON C.Code = A.CountryCode
                WHERE A.AccountNumber = @AccountNumber";

                comm.Parameters.AddWithValue("@AccountNumber", upsAccountNumber);

                conn.Open();

                var reader = comm.ExecuteReader();

                while (reader.Read())
                {
                    result.Name = null;
                    result.CompanyName = reader.IsDBNull(0) ? null : reader.GetString(0);
                    result.AddressLine1 = reader.IsDBNull(1) ? null : reader.GetString(1);
                    result.AddressLine2 = reader.IsDBNull(2) ? null : reader.GetString(2);
                    result.Town = reader.IsDBNull(3) ? null : reader.GetString(3);
                    result.StateProvinceCode = reader.IsDBNull(4) ? null : reader.GetString(4);
                    result.County = null;
                    result.Postcode = reader.IsDBNull(5) ? null : reader.GetString(5);
                    result.CountryCodeISOAlpha2 = reader.IsDBNull(6) ? null : reader.GetString(6);
                    result.LocationName = reader.IsDBNull(7) ? null : reader.GetString(7);
                    result.TaxID = reader.IsDBNull(8) ? null : reader.GetString(8);
                    result.CountryID = reader.GetInt16(9);
                }

                reader.Close();

                conn.Close();
            }

            return result;
        }

        /// <summary>
        /// *** Actually this would be great if we could pass in an accountNumber and use that to pull the Address data from SQL.
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        public static ShipNS.AddressType DesignersGuildAddressType(Address dgAddress)
        {
            return new ShipNS.AddressType()
            {
                AddressLine = new string[]
                {
                    dgAddress.AddressLine1,
                    dgAddress.AddressLine2
                },
                Town = dgAddress.Town,
                City = dgAddress.Town,
                PostalCode = dgAddress.Postcode,
                CountryCode = dgAddress.CountryCodeISOAlpha2,
                StateProvinceCode = dgAddress.StateProvinceCode
            };
        }

        /// <summary>
        /// *** Actually this would be great if we could pass in an accountNumber and use that to pull the Address data from SQL.
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        public static ShipNS.ShipperType DesignersGuildShipperType(string upsAccountNumber, Address dgAddress)
        {
            return new ShipNS.ShipperType()
            {
                Address = new ShipNS.ShipAddressType()
                {
                    AddressLine = new string[]
                    {
                        dgAddress.AddressLine1,
                        dgAddress.AddressLine2
                    },
                    City = dgAddress.Town,
                    PostalCode = dgAddress.Postcode,
                    CountryCode = dgAddress.CountryCodeISOAlpha2,
                    StateProvinceCode = dgAddress.StateProvinceCode
                },
                AttentionName = dgAddress.LocationName,
                CompanyDisplayableName = dgAddress.CompanyName,
                EMailAddress = "itsupport@designersguild.com",
                FaxNumber = null,
                Name = dgAddress.LocationName,
                Phone = new ShipNS.ShipPhoneType()
                {
                    Number = "02078937400",
                    Extension = null
                },
                ShipperNumber = upsAccountNumber,
                TaxIdentificationNumber = null, // EEI only
                TaxIDType = null // EEI only
            };
        }

        /// <summary>
        /// *** Actually this would be great if we could pass in an accountNumber and use that to pull the Address data from SQL.
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        public static ShipNS.ShipToType DesignersGuildShipToType(Address dgAddress)
        {
            return new ShipNS.ShipToType()
            {
                Address = new ShipNS.ShipToAddressType()
                {
                    AddressLine = new string[]
                    {
                        dgAddress.AddressLine1,
                        dgAddress.AddressLine2
                    },
                    City = dgAddress.Town,
                    PostalCode = dgAddress.Postcode,
                    CountryCode = dgAddress.CountryCodeISOAlpha2,
                    StateProvinceCode = dgAddress.StateProvinceCode
                },
                AttentionName = dgAddress.LocationName,
                CompanyDisplayableName = dgAddress.CompanyName,
                EMailAddress = "itsupport@designersguild.com",
                FaxNumber = null,
                LocationID = dgAddress.LocationName.TrimReduceTruncate(10),
                Name = dgAddress.CompanyName,
                Phone = new ShipNS.ShipPhoneType()
                {
                    Number = "02078937400",
                    Extension = null
                },
                TaxIdentificationNumber = null, // EEI only
                TaxIDType = null // EEI only
            };
        }

        public static ShipNS.ProductType[] GenerateProducts(List<SharedEFClasses.ReturnModels.ReturnParcel_Product> returning)
        {
            var results = new List<ShipNS.ProductType>();

            returning.ForEach(r =>
            {
                results.Add(new ShipNS.ProductType()
                {
                    CommodityCode = $"{r.CommodityCode}",
                    Description = new string[]
                    {
                        r.Description.TrimReduceTruncate(35)
                    },
                    EEIInformation = null, // EEI only
                    ExcludeFromForm = null, // Don't exclude from any forms
                    ExportType = null, // EEI only
                    JointProductionIndicator = null, // NAFTA CO only
                    MarksAndNumbers = null, // CO only
                    NetCostCode = null, // NAFTA CO only
                    NetCostDateRange = null, // NAFTA CO only
                    NumberOfPackagesPerCommodity = null, // Applicable for CO
                    OriginCountryCode = r.OriginCountryCode, // *** The country or territory in which the good was manufactured, produced or grown. 
                                                             // For detailed information on country or territory of origin, certificate of origin, rules of origin, 
                                                             // and any related matters, please refer to the U.S. Customs and Border Protection Web site at www.customs.gov 
                                                             // or contact your country’s or territory's Customs authority.
                    PackingListInfo = null, // *** Required for packaging list and Air Freight Packing List. No idea.
                    PartNumber = r.Product?.Code.TrimReduceTruncate(35),
                    PreferenceCriteria = null, // NAFTA CO only
                    ProducerInfo = null, // NAFTA CO only
                    ProductCurrencyCode = null, // Not mentioned in the documentation! ***
                    ProductWeight = null, // Applies to CO and EEI forms only. Required for CO and EEI forms.
                    ScheduleB = null, // EEI only
                    SEDTotalValue = null, // Applies to EEI forms only. Required for EEI form.
                    Unit = new ShipNS.UnitType()
                    {
                        UnitOfMeasurement = new ShipNS.UnitOfMeasurementType()
                        {
                            Code = (r.Product?.StockUnit.Units ?? "EA").TrimReduceTruncate(7) // See List (C) ***
                        },
                        Number = r.Quantity.ToString("0"),
                        Value = (r.Value).ToString("0.00")
                    },
                    VehicleID = null // EEI only
                });
            });

            return results.ToArray();
        }
    }
}
