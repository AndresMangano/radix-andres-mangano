export type AsideProps = {
    sections: {
        label: string;
        link: string;
    }[];
}

export function Aside({sections}: AsideProps) {
    return (
        <aside>
            <ul>
            {
                sections.map(s =>
                    <li key={s.label}>
                        <a href={s.link}>{s.label}</a>
                    </li>)
            }
            </ul>
        </aside>
    );
}