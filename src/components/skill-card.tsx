import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Skill = {
  id: string;
  title: string;
  icon: React.ElementType;
  progress: number;
  description: string;
  image: string;
};

type SkillCardProps = {
  skill: Skill;
};

const getPlaceholderImage = (id: string) => {
  return PlaceHolderImages.find((img) => img.id === id);
};

export default function SkillCard({ skill }: SkillCardProps) {
  const { title, icon: Icon, progress, description, image } = skill;
  const placeholder = getPlaceholderImage(image);

  return (
    <div className="glass-card flex flex-col">
       <div className="relative h-48 w-full">
        {placeholder && (
            <Image
                src={placeholder.imageUrl}
                alt={placeholder.description}
                data-ai-hint={placeholder.imageHint}
                fill
                className="object-cover rounded-t-2xl"
            />
        )}
         <div className="absolute top-3 right-3 bg-background/70 backdrop-blur-sm p-2 rounded-full">
            <Icon className="h-6 w-6 glowing-icon text-secondary" />
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 flex-grow">{description}</p>
        <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm font-medium">
                <span className="text-muted-foreground">Progress</span>
                <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 [&>div]:bg-secondary" />
        </div>
        <Button className="w-full gradient-btn gradient-btn-2 mt-auto">Enroll Now</Button>
      </div>
    </div>
  );
}
