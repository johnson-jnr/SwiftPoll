import { PieChart, Pie, Cell } from 'recharts';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/shadcn/chart';
import { POLL_PALETTE } from '@/lib/pollColors';

interface Option {
    id: number;
    text: string;
    vote_count: number;
}

const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    name,
}: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    name: string;
}) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fontWeight={500}
        >
            {name}
        </text>
    );
};

export default function PollPieChart({
    options,
    totalVotes,
}: {
    options: Option[];
    totalVotes: number;
}) {
    const allData = options.map((opt, i) => ({
        configKey: `option${i}`,
        name: opt.text,
        value: opt.vote_count,
        fill: POLL_PALETTE[i % POLL_PALETTE.length],
    }));

    const chartData = allData.filter((d) => d.value > 0);

    const chartConfig: ChartConfig = Object.fromEntries(
        allData.map((d) => [d.configKey, { label: d.name, color: d.fill }]),
    );

    if (totalVotes === 0) {
        return (
            <div className="w-full aspect-square flex items-center justify-center">
                <div className="w-[75%] aspect-square rounded-full border-2 border-border flex items-center justify-center p-6">
                    <p className="text-sm text-muted-foreground text-center">
                        A pie chart will be rendered here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <ChartContainer config={chartConfig} className="w-full aspect-square">
            <PieChart>
                <ChartTooltip
                    content={
                        <ChartTooltipContent nameKey="configKey" hideLabel />
                    }
                />
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderLabel}
                >
                    {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                    ))}
                </Pie>
            </PieChart>
        </ChartContainer>
    );
}
