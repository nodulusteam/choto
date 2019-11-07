import { Repo, Field, Model, ObjectId, Transform, ModelInMemory } from '@methodus/data';

@ModelInMemory('AdModel')
export class AdModel extends Repo<AdModel> {


    @Field('keyid')
    public keyid: string;

    @Field()
    public name?: string;

    @Field()
    public text?: string;

    @Field()
    public image?: string;

    @Field()
    public dateentered?: string;

    @Field()
    public status?: string;

    constructor(copyData?: any) {
        super(copyData, AdModel);
    }
}
