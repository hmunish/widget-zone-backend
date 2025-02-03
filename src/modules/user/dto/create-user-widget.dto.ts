import { IsNotEmpty, ValidateNested, IsIn } from "class-validator";
import { Type } from "class-transformer";
import { ObjectId } from "mongodb";
import { Newsletter } from "src/shared/dto/widgets/newsletter.dto";
import { Advertisement } from "src/shared/dto/widgets/advertisement.dto";

const TypeToDtoMap = {
  newsletter: Newsletter,
  advertisement: Advertisement,
};

export class WidgetType {
  @IsNotEmpty()
  id: ObjectId;

  @IsNotEmpty()
  @IsIn(Object.keys(TypeToDtoMap), {
    message: `Name must be one of: ${Object.keys(TypeToDtoMap).join(", ")}`,
  })
  name: keyof typeof TypeToDtoMap;
}

export class CreateUserWidgetDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WidgetType)
  type: WidgetType;

  @IsNotEmpty()
  @ValidateNested()
  @Type((options) => TypeToDtoMap[(options.object as CreateUserWidgetDto).type.name])
  data: Newsletter | Advertisement;
}
