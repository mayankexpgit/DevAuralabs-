
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { icons } from '@/lib/data';
import { useCurrency } from '@/context/currency-context';

type Course = {
  id: string;
  title: string;
  icon: string;
  level: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  posterUrl: string;
};

type CourseCardProps = {
  course: Course;
};

export default function CourseCard({ course }: CourseCardProps) {
  const { title, icon, level, price, compareAtPrice, posterUrl, id } = course;
  const Icon = icons[icon];
  const { getConvertedPrice } = useCurrency();

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="relative w-full overflow-hidden rounded-t-2xl aspect-video">
        <div
          className="absolute inset-0"
        >
          {posterUrl && (
              <Image
                  src={posterUrl}
                  alt={title}
                  fill
                  className="object-cover"
              />
          )}
        </div>
        <Badge variant="secondary" className="absolute top-2 left-2 bg-background/70 backdrop-blur-sm text-primary border-primary/20 text-[10px] px-1.5 py-0.5">
            {level}
        </Badge>
        <div className="absolute top-2 right-2 bg-background/70 backdrop-blur-sm p-1.5 rounded-full">
            {Icon && <Icon className="h-4 w-4 text-primary" />}
        </div>
      </div>
      <div className="p-1 flex flex-col flex-grow items-center text-center">
        <h3 className="text-xs font-bold mb-0.5 flex-grow">{title}</h3>
        
        <div className="flex items-baseline gap-1 mb-1 justify-center">
            {compareAtPrice && (
                <p className="text-[10px] text-muted-foreground line-through">{getConvertedPrice(compareAtPrice)}</p>
            )}
            <p className="text-xs font-bold text-green">{getConvertedPrice(price)}</p>
        </div>

        <div className="flex flex-col w-full gap-2 mt-auto">
            <Link href={`/courses/${id}`}>
                <Button size="xs" variant="ghost" className="text-green hover:bg-green/10 hover:text-green w-full text-[10px] h-7">
                    View Course
                </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}
