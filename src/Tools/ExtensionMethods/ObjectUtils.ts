import {BranchOffice} from "../../Models/Entities/BranchOffice";
import {IBranchOffice} from "../../Interfaces/Database/IBranchOffice";
import {City} from "../../Models/Entities/City";
import {State} from "../../Models/Entities/State";
import {IState} from "../../Interfaces/Database/IState";
import {ICity} from "../../Interfaces/Database/ICity";
import {IPacking} from "../../Interfaces/Database/IPacking";
import {Packing} from "../../Models/Entities/Packing";
import {Unit} from "../../Models/Entities/Unit";
import {IUnit} from "../../Interfaces/Database/IUnit";
import {Presentation} from "../../Models/Entities/Presentation";
import {IPresentation} from "../../Interfaces/Database/IPresentation";
import {Product} from "../../Models/Entities/Product";
import {IProduct} from "../../Interfaces/Database/IProduct";
import {ICategory} from "../../Interfaces/Database/ICategory";
import {Category} from "../../Models/Entities/Category";
import {Vendor} from "../../Models/Entities/Vendor";
import {IVendor} from "../../Interfaces/Database/IVendor";
import {Settings} from "../../Models/Entities/Settings";
import {ISetting} from "../../Interfaces/Database/ISettings";
import {ProductImage} from "../../Models/Entities/ProductImage";
import {IProductImage} from "../../Interfaces/Database/IProductImage";
import {ProductToOffice} from "../../Models/Entities/ProductToOffice";
import {IProductToOffice} from "../../Interfaces/Database/IProductToOffice";
import {User} from "../../Models/Entities/User";
import {IUserType} from "../../Interfaces/Database/IUserType";
import {UserType} from "../../Models/Entities/UserType";
import {IUser} from "../../Interfaces/Database/IUser";
import {Service} from "../../Models/Entities/Service";
import {IService} from "../../Interfaces/Database/IService";
import {IServiceToOffice} from "../../Interfaces/Database/IServiceToOffice";
import {ServiceToOffice} from "../../Models/Entities/ServiceToOffice";
import {IStatus} from "../../Interfaces/Database/IStatus";
import {Status} from "../../Models/Entities/Status";
import {IBrand} from "../../Interfaces/Database/IBrand";
import {Brand} from "../../Models/Entities/Brand";
import {PresentationImage} from "../../Models/Entities/PresentationImage";
import {IPresentationImage} from "../../Interfaces/Database/IPresentationImage";

export abstract class ObjectUtils {
    public static ToServiceObject(service: Service, shouldParseServiceToOffice: boolean = true): IService {
        let serviceObject: IService = {
            Id: service.Id,
            Description: service.Description,
            Name: service.Name,
            Barcode: service.Barcode,
            Code: service.Code,
            SellingPrice: service.SellingPrice,
            Vendor: (service.Vendors && service.Vendors.length != 0) ? service.Vendors.map(vendor => this.ToVendorObject(vendor)) : [],
        }
        if (shouldParseServiceToOffice) {
            serviceObject.ServiceToOffice = (service.ServiceToOffice && service.ServiceToOffice.length != 0) ? service.ServiceToOffice.map(service => this.ToServiceToOffice(service)) : [];
        }
        return serviceObject;
    }

    public static ToProductObject(product: Product, shouldParseProductOffice: boolean = true): IProduct {
        let productObject: IProduct = {
            Id: product.Id ? product.Id : null,
            Description: product.Description,
            Name: product.Name,
            Fragile: product.Fragile,
            Perishable: product.Perishable,
            HighValue: product.HighValue,
            Categories: (product.Categories && product.Categories.length != 0) ? product.Categories.map(category => this.ToCategoryObject(category)) : [],
            Presentations: (product.Presentations && product.Presentations.length != 0) ? product.Presentations.map(presentation => this.ToPresentationObject(presentation)) : [],
            Vendors: (product.Vendors && product.Vendors.length != 0) ? product.Vendors.map(vendor => this.ToVendorObject(vendor)) : [],
            Images: (product.Images && product.Images.length != 0) ? product.Images.map(images => this.ToProductImageObject(images)) : [],
            Code: product.Code ? product.Code : null,
            Status: product.Status ? this.ToStatusObject(product.Status) : null
        };
        if (shouldParseProductOffice) {
            productObject.ProductToOffice = (product.ProductToOffice && product.ProductToOffice.length != 0) ? product.ProductToOffice.map(relation => this.ToProductToOffice(relation, product)) : [];
        }
        return productObject;
    }

    public static ToServiceToOffice(serviceToOffice: ServiceToOffice, service?: Service): IServiceToOffice {
        return {
            Id: serviceToOffice.Id,
            Active: serviceToOffice.Active,
            Office: serviceToOffice.Office ? this.ToBranchOfficeObject(serviceToOffice.Office) : null,
            Service: serviceToOffice.Service ? this.ToServiceObject(serviceToOffice.Service, false) : ((service) ? this.ToServiceObject(service, false) : null)
        };
    }

    public static ToProductToOffice(productToOffice: ProductToOffice, product?: Product): IProductToOffice {
        return {
            Id: productToOffice.Id,
            Active: productToOffice.Active,
            Office: productToOffice.Office ? this.ToBranchOfficeObject(productToOffice.Office) : null,
            Product: productToOffice.Product ? this.ToProductObject(productToOffice.Product, false) : ((product) ? this.ToProductObject(product, false) : null)
        };
    }

    public static ToProductImageObject(image: ProductImage): IProductImage {
        return {
            Id: image.Id,
            Url: image.Url
        };
    }
    public static ToPresentationImageObject(image:PresentationImage):IPresentationImage{
        return {
            Id:image.Id,
            Url:image.Url
        }
    }
    public static ToVendorObject(vendor: Vendor): IVendor {
        return {
            Id: vendor.Id ? vendor.Id : null,
            VendorCode: vendor.VendorCode ? vendor.VendorCode : null,
            Rfc: vendor.Rfc,
            Address: vendor.Address,
            Email: vendor.Email,
            PhoneNumber: vendor.PhoneNumber,
            PhoneNumber2: vendor.PhoneNumber2,
            Alias: vendor.Alias,
            Name: vendor.Name,
            Status: vendor.Status,
        }
    }

    public static ToCategoryObject(category: Category): ICategory {
        return {
            Id: category.Id ? category.Id : null,
            Name: category.Name
        };
    }

    public static ToPresentationObject(presentation: Presentation): IPresentation {
        return {
            Id: presentation.Id ? presentation.Id : null,
            Amount: presentation.Amount,
            Code: presentation.Code,
            Length: presentation.Length,
            Width: presentation.Width,
            Weight: presentation.Weight,
            Height: presentation.Height,
            Barcode: presentation.Barcode,
            Color: presentation.Color,
            Status: presentation.Status ? this.ToStatusObject(presentation.Status) : null,
            Brand: presentation.Brand ? this.ToBrandObject(presentation.Brand) : null,
            Unit: presentation.Unit ? this.ToUnitObject(presentation.Unit) : null,
            Packing: presentation.Packing ? this.ToPackingObject(presentation.Packing) : null,
            Images:presentation.Images && presentation.Images.length != 0 ? presentation.Images.map(image => this.ToPresentationImageObject(image)) : []
        };
    }

    public static ToPackingObject(packing: Packing): IPacking {
        return {
            Id: packing.Id,
            Code: packing.Code,
            Name: packing.Name
        };
    }

    public static ToUnitObject(unit: Unit): IUnit {
        return {
            Id: unit.Id,
            Code: unit.Code,
            Name: unit.Name
        };
    }

    public static ToBranchOfficeObject(branchOffice: BranchOffice): IBranchOffice {
        return {
            Name: branchOffice.Name,
            Id: branchOffice.Id,
            City: branchOffice.City ? this.ToCityObject(branchOffice.City, false) : null,
            Status: branchOffice.Status,
            PhoneNumber: branchOffice.PhoneNumber,
            Address: branchOffice.Address,
            Number: branchOffice.Number
        };
    }

    public static ToCityObject(city: City, shouldParseCityToOffice: boolean): ICity {
        let cityObject: ICity = {
            Name: city.Name,
            Id: city.Id,
            Code: city.Code,
            State: city.State ? this.ToStateObject(city.State) : null
        }
        if (shouldParseCityToOffice) {
            cityObject.BranchOffices = (city.BranchOffices && city.BranchOffices.length != 0) ? city.BranchOffices.map(branch => this.ToBranchOfficeObject(branch)) : [];
        }
        return cityObject;
    }

    public static ToStateObject(state: State): IState {
        return {
            Name: state.Name,
            Id: state.Id,
            Code: state.Code
        };
    }

    public static ToSettingObject(setting: Settings): ISetting {
        return {
            Id: setting.Id,
            Name: setting.Name,
            Description: setting.Description,
            Value: setting.Value
        };
    }

    public static ToUserObject(user: User): IUser {
        return {
            Id: user.Id,
            Name: user.Name,
            LastName: user.LastName,
            Email: user.Email,
            PhoneNumber: user.PhoneNumber,
            IsActive: user.IsActive,
            CreatedAt: user.CreatedAt,
            UpdatedAt: user.UpdatedAt,
            Birthdate: user.Birthdate,
            FirebaseId: user.FirebaseId,
            UserType: user.UserType ? this.ToUserTypeObject(user.UserType) : null,
        };
    }

    public static ToUserTypeObject(userType: UserType): IUserType {
        return {
            Id: userType.Id,
            Name: userType.Name
        };
    }

    public static ToStatusObject(status: Status): IStatus {
        return {
            Id: status.Id,
            Name: status.Name
        };
    }

    public static ToBrandObject(brand: Brand): IBrand {
        return {
            Id: brand.Id,
            Name: brand.Name
        };
    }
}
