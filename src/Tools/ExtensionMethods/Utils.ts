import {User} from "../../Models/Entities/User";
import {IFirebaseUser} from "../../Interfaces/IFirebaseUser";
import {ICategory} from "../../Interfaces/Database/ICategory";
import {Category} from "../../Models/Entities/Category";
import {IBranchOffice} from "../../Interfaces/Database/IBranchOffice";
import {BranchOffice} from "../../Models/Entities/BranchOffice";
import {ICity} from "../../Interfaces/Database/ICity";
import {IState} from "../../Interfaces/Database/IState";
import {State} from "../../Models/Entities/State";
import {City} from "../../Models/Entities/City";
import {Packing} from "../../Models/Entities/Packing";
import {IPacking} from "../../Interfaces/Database/IPacking";
import {IPresentation} from "../../Interfaces/Database/IPresentation";
import {IUnit} from "../../Interfaces/Database/IUnit";
import {Unit} from "../../Models/Entities/Unit";
import {Presentation} from "../../Models/Entities/Presentation";
import {IProduct} from "../../Interfaces/Database/IProduct";
import {Vendor} from "../../Models/Entities/Vendor";
import {IVendor} from "../../Interfaces/Database/IVendor";
import {Product} from "../../Models/Entities/Product";
import {ISetting} from "../../Interfaces/Database/ISettings";
import {Settings} from "../../Models/Entities/Settings";
import {ProductImage} from "../../Models/Entities/ProductImage";
import {IProductImage} from "../../Interfaces/Database/IProductImage";
import {ProductToOffice} from "../../Models/Entities/ProductToOffice";
import {IProductToOffice} from "../../Interfaces/Database/IProductToOffice";
import {IService} from "../../Interfaces/Database/IService";
import {Service} from "../../Models/Entities/Service";
import {ServiceToOffice} from "../../Models/Entities/ServiceToOffice";
import {IServiceToOffice} from "../../Interfaces/Database/IServiceToOffice";
import {IStatus} from "../../Interfaces/Database/IStatus";
import {Status} from "../../Models/Entities/Status";
import {IBrand} from "../../Interfaces/Database/IBrand";
import {Brand} from "../../Models/Entities/Brand";
import {IPresentationImage} from "../../Interfaces/Database/IPresentationImage";
import {PresentationImage} from "../../Models/Entities/PresentationImage";

export abstract class Utils {
    public static ToService(service: IService, shouldParseServiceToOffice: boolean = true): Service {
        let serviceInstance = new Service();
        let serviceToOffices: ServiceToOffice[] = [];
        serviceInstance.Id = service.Id;
        serviceInstance.Code = service.Code;
        serviceInstance.Barcode = service.Barcode;
        serviceInstance.Name = service.Name;
        serviceInstance.SellingPrice = service.SellingPrice;
        serviceInstance.Description = service.Description;
        serviceInstance.Vendors = (service.Vendor && service.Vendor.length != 0) ? service.Vendor.map(vendor => this.ToVendor(vendor)) : [];
        if (shouldParseServiceToOffice && service.ServiceToOffice && service.ServiceToOffice.length != 0) {
            service.ServiceToOffice.forEach(serviceToOffice => {
                let parsedObject = this.ToServiceToOffice(serviceToOffice);
                serviceToOffices.push(parsedObject);
            });
        }
        serviceInstance.ServiceToOffice = serviceToOffices;
        return serviceInstance;
    }

    /**
     * Maps a user entity to a firebase user object if the password is provided it will map it to
     * @param user - the user information stored in the database
     * @param password - optional param to map a new signup user
     * */
    public static ToFirebaseUser(user: User, password?: string): IFirebaseUser {
        let firebaseUser: IFirebaseUser = {
            Email: user.Email,
            Disabled: false,
            Name: user.Name,
            LastName: user.LastName,
            PhoneNumber: user.PhoneNumber,
        };

        if (user.FirebaseId)
            firebaseUser.Uid = user.FirebaseId

        if (password)
            firebaseUser.Password = password;

        return firebaseUser;
    }

    public static ToCategory(category: ICategory): Category {
        let categoryInstance = new Category();
        categoryInstance.Name = category.Name;
        if (category.Id) {
            categoryInstance.Id = category.Id;
        }
        return categoryInstance;
    }

    public static ToBranchOffice(branchOffice: IBranchOffice): BranchOffice {
        let branchInstance = new BranchOffice();
        if (branchOffice.Id)
            branchInstance.Id = branchOffice.Id;
        if (branchOffice.Number)
            branchInstance.Number = branchOffice.Number;
        branchInstance.Name = branchOffice.Name;
        branchInstance.Address = branchOffice.Address;
        branchInstance.Status = branchOffice.Status;
        branchInstance.PhoneNumber = branchOffice.PhoneNumber;
        branchInstance.City = branchOffice.City ? this.ToCity(branchOffice.City) : null;
        return branchInstance;

    }

    public static ToCity(city: ICity): City {
        let cityInstance = new City();
        if (city.Id) {
            cityInstance.Id = city.Id;
        }
        cityInstance.Name = city.Name;
        cityInstance.Code = city.Code;
        cityInstance.State = city.State ? this.ToState(city.State) : null;
        return cityInstance;
    }

    public static ToState(state: IState): State {
        let stateInstance = new State();
        if (state.Id)
            stateInstance.Id = state.Id;
        stateInstance.Code = state.Code;
        stateInstance.Name = state.Name;
        return stateInstance;
    }

    public static ToUnit(unit: IUnit): Unit {
        let unitInstance = new Unit();
        if (unit.Id) {
            unitInstance.Id = unit.Id;
        }
        unitInstance.Name = unit.Name;
        unitInstance.Code = unit.Code;
        return unitInstance;
    }

    public static ToPacking(packing: IPacking): Packing {
        let packingInstance = new Packing();
        if (packing.Id) {
            packingInstance.Id = packing.Id;
        }
        packingInstance.Name = packing.Name;
        packingInstance.Code = packing.Code;
        return packingInstance;
    }

    public static ToPresentation(presentation: IPresentation): Presentation {
        let presentationInstance = new Presentation();
        if (presentation.Id) {
            presentationInstance.Id = presentation.Id;
        }
        presentationInstance.Code = presentation.Code;
        presentationInstance.Amount = presentation.Amount;
        presentationInstance.Length = presentation.Length;
        presentationInstance.Weight = presentation.Weight;
        presentationInstance.Width = presentation.Width;
        presentationInstance.Height = presentation.Height;
        presentationInstance.Color = presentation.Color;
        presentationInstance.Barcode = presentation.Barcode;
        if(presentation.Status){
            presentationInstance.Status = this.ToStatus(presentation.Status);
        }
        if(presentation.Brand){
            presentationInstance.Brand = this.ToBrand(presentation.Brand);
        }
        if (presentation.Packing)
            presentationInstance.Packing = this.ToPacking(presentation.Packing);

        if (presentation.Unit)
            presentationInstance.Unit = this.ToUnit(presentation.Unit);
        if(presentation.Product){
            presentationInstance.Product = this.ToProduct(presentation.Product,false,false);
        }
        return presentationInstance;
    }

    public static ToProductImage(image: IProductImage): ProductImage {
        let productImage = new ProductImage();
        if (image.Id)
            productImage.Id = image.Id;
        if (image.Product)
            productImage.Product = this.ToProduct(image.Product);
        productImage.Url = image.Url;
        return productImage;
    }
    public static ToPresentationImage(image:IPresentationImage):PresentationImage{
        let presentationImage = new PresentationImage();
        if(image.Id)
            presentationImage.Id = image.Id;
        if(image.Presentation)
            presentationImage.Presentation = this.ToPresentation(image.Presentation);
        presentationImage.Url = image.Url;
        return presentationImage;
    }
    public static ToProductToOffice(productToOffice: IProductToOffice): ProductToOffice {
        let productInstance = new ProductToOffice();
        productInstance.Id = productToOffice.Id;
        productInstance.Product = productToOffice.Product ? this.ToProduct(productToOffice.Product, false) : null;
        productInstance.Office = productToOffice.Office ? this.ToBranchOffice(productToOffice.Office) : null;
        productInstance.Active = productToOffice.Active;
        return productInstance;
    }

    public static ToServiceToOffice(serviceToOffice: IServiceToOffice): ServiceToOffice {
        let relationInstance = new ServiceToOffice();
        relationInstance.Id = serviceToOffice.Id;
        relationInstance.Active = serviceToOffice.Active;
        relationInstance.Office = serviceToOffice.Office ? this.ToBranchOffice(serviceToOffice.Office) : null;
        relationInstance.Service = serviceToOffice.Service ? this.ToService(serviceToOffice.Service, false) : null;
        return relationInstance;
    }

    public static ToProduct(product: IProduct, shouldParseProductOffice: boolean = true,shouldParsePresentations:boolean=true): Product {
        let productInstance = new Product();
        let categories: Category[] = [];
        let vendors: Vendor[] = [];
        let presentations: Presentation[] = [];
        let productImages: ProductImage[] = [];
        let productToOffices: ProductToOffice[] = [];
        if (product.Id) {
            productInstance.Id = product.Id;
        }

        if (shouldParseProductOffice && product.ProductToOffice && product.ProductToOffice.length != 0) {
            product.ProductToOffice.forEach(productToOffice => {
                let parsedObject = this.ToProductToOffice(productToOffice);
                productToOffices.push(parsedObject);
            });
        }
        if (product.Images && product.Images.length != 0) {
            product.Images.forEach(image => {
                let parsedImage = this.ToProductImage(image);
                productImages.push(parsedImage);
            });
        }
        if (product.Categories && product.Categories.length != 0) {
            product.Categories.forEach((category) => {
                let parsedCategory = this.ToCategory(category);
                categories.push(parsedCategory);
            });
        }
        if (product.Vendors && product.Vendors.length != 0) {
            product.Vendors.forEach((vendor) => {
                let parsedVendor = this.ToVendor(vendor);
                vendors.push(parsedVendor);
            });
        }
        if (shouldParsePresentations && product.Presentations && product.Presentations.length != 0) {
            product.Presentations.forEach(presentation => {
                let parsedPresentation = this.ToPresentation(presentation);
                presentations.push(parsedPresentation);
            });
        }
        productInstance.ProductToOffice = productToOffices;
        productInstance.Vendors = vendors;
        productInstance.Presentations = presentations;
        productInstance.Categories = categories;
        productInstance.Images = productImages;
        productInstance.Description = product.Description;
        productInstance.Name = product.Name;
        productInstance.Fragile = product.Fragile;
        productInstance.Perishable = product.Perishable;
        productInstance.HighValue = product.HighValue;
        productInstance.Status = product.Status ? this.ToStatus(product.Status): null;
        if (product.Code) {
            productInstance.Code = product.Code;
        }
        return productInstance;
    }

    public static ToVendor(vendor: IVendor): Vendor {
        let vendorInstance = new Vendor()
        if (vendor.Id) {
            vendorInstance.Id = vendor.Id;
        }
        if (vendor.VendorCode) {
            vendorInstance.VendorCode = vendor.VendorCode;
        }
        vendorInstance.Address = vendor.Address;
        vendorInstance.Rfc = vendor.Rfc;
        vendorInstance.Email = vendor.Email;
        vendorInstance.PhoneNumber = vendor.PhoneNumber;
        vendorInstance.PhoneNumber2 = vendor.PhoneNumber2;
        vendorInstance.Alias = vendor.Alias;
        vendorInstance.Name = vendor.Name;
        vendorInstance.Status = vendor.Status;
        return vendorInstance;
    }

    public static ToSetting(setting: ISetting): Settings {
        let settingInstance = new Settings();
        if (setting.Id) {
            settingInstance.Id = setting.Id;
        }
        settingInstance.Name = setting.Name;
        settingInstance.Description = setting.Description;
        settingInstance.Value = setting.Value;
        return settingInstance;
    }
    public static ToStatus(status:IStatus):Status{
        let statusInstance = new Status();
        statusInstance.Id = status.Id;
        statusInstance.Name = status.Name;
        return statusInstance;
    }
    public static ToBrand(brand:IBrand):Brand{
        let brandInstance= new Brand()
        brandInstance.Id = brand.Id;
        brandInstance.Name = brand.Name;
        return brandInstance;
    }
}
